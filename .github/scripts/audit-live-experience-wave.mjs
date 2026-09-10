import fs from "node:fs/promises";

const CDP_HTTP = "http://127.0.0.1:9250";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const SITES = Object.freeze({
  qc: {
    url: "https://heruahmose.github.io/QueenCalifia-CyberAI/",
    deployMarker: "https://heruahmose.github.io/QueenCalifia-CyberAI/deploy-commit.txt",
    expectedSha: "a4b81a7723cda693f2a08817e1bbcd74c5ccd264",
  },
  techbridge: {
    url: "https://techbridge-collective.org/",
    expectedSha: "b7f00ec32c23882898a5f388ca441c25e5360b95",
    provenance: "vercel-production",
  },
  tamerian: {
    url: "https://tamerian-materials.com/",
    expectedSha: "b829cdafedb2549da711f4aed4d48c00a2280e75",
    provenance: "cloudflare-production",
  },
  peoples: {
    url: "https://heruahmose.github.io/peoples-portfolio/",
    deployMarker: "https://heruahmose.github.io/peoples-portfolio/deploy-commit.txt",
    expectedSha: "46b72b7be116e40cb78ee9bd31e511ad309b652c",
  },
  bluegold: {
    url: "https://heruahmose.github.io/blue-gold-daily/",
    canonicalRoute: "https://heruahmose.github.io/blue-gold-daily/layers.html",
    deployMarker: "https://heruahmose.github.io/blue-gold-daily/deploy-commit.txt",
    expectedSha: "7b1e9e25b6ae0ace17f542863da1e7f794c9bba5",
  },
});

const report = {
  startedAt: new Date().toISOString(),
  preflight: {},
  sites: {},
  failures: [],
};

const runtimeIssues = [];
const requestUrls = new Map();
let activeSite = null;
let activeOrigin = null;

function fail(message, detail) {
  const error = new Error(message);
  if (detail !== undefined) error.detail = detail;
  throw error;
}

async function fetchOk(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) fail(`HTTP ${response.status} for ${url}`);
  return response;
}

async function preflight() {
  for (const [name, config] of Object.entries(SITES)) {
    const response = await fetchOk(config.url);
    const item = {
      status: response.status,
      finalUrl: response.url,
      server: response.headers.get("server"),
      vercelId: response.headers.get("x-vercel-id"),
      cfRay: response.headers.get("cf-ray"),
      expectedSha: config.expectedSha,
      provenance: config.provenance || "deploy-marker",
    };
    if (config.deployMarker) {
      const markerResponse = await fetchOk(config.deployMarker);
      const marker = (await markerResponse.text()).trim();
      item.deployMarker = marker;
      if (marker !== config.expectedSha) {
        fail(`${name} deploy marker mismatch`, {
          expected: config.expectedSha,
          observed: marker,
        });
      }
    }
    if (config.canonicalRoute) {
      const routeResponse = await fetchOk(config.canonicalRoute);
      item.canonicalRouteStatus = routeResponse.status;
      item.canonicalRouteFinalUrl = routeResponse.url;
    }
    report.preflight[name] = item;
  }
}

class CDP {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.ws = null;
  }
  async open() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", event => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const waiter = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error
          ? waiter.reject(new Error(JSON.stringify(msg.error)))
          : waiter.resolve(msg.result);
        return;
      }
      observeEvent(msg.method, msg.params || {});
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text ||
          "Runtime.evaluate failed"
      );
    }
    return result.result.value;
  }
  close() {
    this.ws?.close();
  }
}

function isActiveOrigin(url) {
  if (!activeOrigin) return false;
  try {
    return new URL(url).origin === activeOrigin;
  } catch {
    return false;
  }
}

function observeEvent(method, params) {
  if (!activeSite) return;
  if (method === "Network.requestWillBeSent") {
    requestUrls.set(params.requestId, params.request?.url || "");
    return;
  }
  if (method === "Network.responseReceived") {
    const status = Number(params.response?.status || 0);
    const url = params.response?.url || "";
    if (status >= 400 && isActiveOrigin(url)) {
      runtimeIssues.push({ site: activeSite, type: "http", status, url });
    }
    return;
  }
  if (method === "Network.loadingFailed") {
    const url = requestUrls.get(params.requestId) || "";
    const reason = params.errorText || "unknown";
    if (
      isActiveOrigin(url) &&
      !params.canceled &&
      !/ERR_ABORTED|blocked by client/i.test(reason)
    ) {
      runtimeIssues.push({ site: activeSite, type: "network", reason, url });
    }
    return;
  }
  if (method === "Runtime.exceptionThrown") {
    runtimeIssues.push({
      site: activeSite,
      type: "exception",
      detail:
        params.exceptionDetails?.exception?.description ||
        params.exceptionDetails?.text ||
        "Runtime exception",
    });
    return;
  }
  if (method === "Runtime.consoleAPICalled" && params.type === "error") {
    runtimeIssues.push({
      site: activeSite,
      type: "console.error",
      detail: (params.args || [])
        .map(arg => arg.value ?? arg.description ?? "")
        .join(" ")
        .slice(0, 1200),
    });
  }
}

async function waitForHttp(url, attempts = 240) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {}
    await sleep(250);
  }
  fail(`timeout waiting for ${url}`);
}

async function waitForEval(cdp, expression, attempts = 80, delay = 100) {
  for (let i = 0; i < attempts; i++) {
    if (await cdp.eval(expression)) return true;
    await sleep(delay);
  }
  fail(`Timed out waiting for browser condition: ${expression}`);
}

async function setDesktop(cdp) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: false });
}

async function setMobile(cdp) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await cdp.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 5,
  });
}

async function setMotion(cdp, value) {
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value }],
  });
}

async function navigate(cdp, url, pause = 1100) {
  const result = await cdp.send("Page.navigate", { url });
  if (result?.errorText) fail(`Navigation failed: ${result.errorText}`);
  await waitForEval(
    cdp,
    `document.readyState === "complete" && (document.body?.innerText || "").length > 20`,
    120,
    100
  );
  await sleep(pause);
}

async function clickText(cdp, text) {
  const clicked = await cdp.eval(`(() => {
    const button = [...document.querySelectorAll('button')].find(node =>
      (node.textContent || '').includes(${JSON.stringify(text)}) &&
      node.getClientRects().length > 0
    );
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) fail(`Visible button not found: ${text}`);
}

async function movePointerTo(cdp, selector) {
  const point = await cdp.eval(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element || element.getClientRects().length === 0) return null;
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  if (!point) fail(`Visible pointer target not found: ${selector}`);
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: point.x,
    y: point.y,
  });
  return point;
}

async function sweep(cdp) {
  return cdp.eval(`(async () => {
    let maxOverflow = 0;
    const height = Math.min(
      Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0),
      24000
    );
    const step = Math.max(360, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y <= height; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 35));
      maxOverflow = Math.max(
        maxOverflow,
        document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 100));
    return Math.max(0, maxOverflow);
  })()`);
}

async function layout(cdp) {
  const sweptOverflow = await sweep(cdp);
  const state = await cdp.eval(`(() => ({
    title: document.title,
    href: location.href,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    broken: [...document.images]
      .filter(image => image.complete && image.naturalWidth === 0)
      .map(image => ({ src: image.currentSrc || image.src, alt: image.alt })),
    bodyLength: (document.body?.innerText || '').length
  }))()`);
  state.sweptOverflow = sweptOverflow;
  if (state.bodyLength < 100) fail("Rendered body is unexpectedly sparse", state);
  if (Math.max(state.overflow, sweptOverflow) > 1)
    fail("Horizontal overflow detected", state);
  if (state.broken.length) fail("Broken images detected", state.broken);
  return state;
}

async function capture(cdp, name) {
  const result = await cdp.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await fs.mkdir("live-experience-evidence", { recursive: true });
  await fs.writeFile(
    `live-experience-evidence/${name}.png`,
    result.data,
    "base64"
  );
}

function assertNoCriticalRuntimeIssues(name, issueStart) {
  const issues = runtimeIssues.slice(issueStart);
  const critical = issues.filter(issue =>
    ["http", "network", "exception"].includes(issue.type)
  );
  if (critical.length) fail(`${name} critical runtime issues`, critical);
  return issues;
}

async function auditQC(cdp) {
  const name = "qc";
  const config = SITES[name];
  activeSite = name;
  activeOrigin = new URL(config.url).origin;
  const issueStart = runtimeIssues.length;
  await setDesktop(cdp);
  await setMotion(cdp, "no-preference");
  await navigate(cdp, config.url);
  await cdp.eval(`localStorage.removeItem('qc_audio_enabled'); location.reload(); true`);
  await sleep(1300);

  const initial = await cdp.eval(`(() => ({
    sound: document.querySelector('[data-qc-sound]')?.dataset.qcSound,
    pressed: document.querySelector('[data-qc-sound]')?.getAttribute('aria-pressed'),
    probe: window.__fleetAudioProbe,
    phase: document.querySelector('.qc-sovereign-awakening')?.dataset.qcAwakeningPhase,
    scanTop: document.querySelector('.qc-awaken-holo-scan') ? getComputedStyle(document.querySelector('.qc-awaken-holo-scan')).top : null,
    avatar: document.querySelector('[data-qc-sovereign-portrait="active-awakening"] img')?.getAttribute('src') || null,
    favicons: [...document.querySelectorAll('link[rel~="icon"]')].map(link => link.href),
    manifest: document.querySelector('link[rel="manifest"]')?.href || null
  }))()`);
  if (
    initial.sound !== "off" ||
    initial.pressed !== "false" ||
    initial.probe?.contexts !== 0 ||
    initial.probe?.oscillators !== 0 ||
    initial.phase !== "sealed" ||
    !initial.scanTop ||
    !initial.avatar?.includes("idle_avatar_sm.png") ||
    !initial.favicons.length ||
    !initial.manifest
  ) fail("QC initial contract failed", initial);

  await sleep(500);
  const scanTopAfter = await cdp.eval(
    `getComputedStyle(document.querySelector('.qc-awaken-holo-scan')).top`
  );
  if (scanTopAfter === initial.scanTop)
    fail("QC holographic scan did not move", { before: initial.scanTop, after: scanTopAfter });

  await clickText(cdp, "AWAKEN SOVEREIGN INTELLIGENCE");
  await sleep(350);
  const linking = await cdp.eval(`(() => ({
    sound: document.querySelector('[data-qc-sound]')?.dataset.qcSound,
    probe: window.__fleetAudioProbe,
    phase: document.querySelector('.qc-sovereign-awakening')?.dataset.qcAwakeningPhase,
    avatar: document.querySelector('[data-qc-sovereign-portrait="active-awakening"] img')?.getAttribute('src') || null
  }))()`);
  if (
    linking.sound !== "off" ||
    linking.probe?.contexts !== 0 ||
    linking.probe?.oscillators !== 0 ||
    linking.phase !== "linking" ||
    !linking.avatar?.includes("active_avatar_sm.png")
  ) fail("QC linking/audio-consent contract failed", linking);

  await cdp.eval(`document.querySelector('[data-qc-sound]')?.click(); true`);
  await sleep(350);
  const enabled = await cdp.eval(`(() => ({
    sound: document.querySelector('[data-qc-sound]')?.dataset.qcSound,
    probe: window.__fleetAudioProbe
  }))()`);
  if (enabled.sound !== "on" || enabled.probe?.contexts < 1 || enabled.probe?.oscillators < 1)
    fail("QC explicit sound opt-in failed", enabled);

  await cdp.eval(`document.querySelector('[data-qc-sound]')?.click(); true`);
  await sleep(250);
  const mutedBefore = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  await waitForEval(cdp, `[...document.querySelectorAll('button')].some(button => button.textContent.includes('ENTER COMMAND FIELD'))`, 50, 100);
  const authority = await cdp.eval(`(() => ({
    phase: document.querySelector('.qc-sovereign-awakening')?.dataset.qcAwakeningPhase,
    avatar: document.querySelector('[data-qc-sovereign-portrait="active-awakening"] img')?.getAttribute('src') || null
  }))()`);
  if (authority.phase !== "authorized" || !authority.avatar?.includes("staff_raised_avatar_sm.png"))
    fail("QC authority identity phase failed", authority);

  await clickText(cdp, "ENTER COMMAND FIELD");
  await sleep(450);
  const command = await cdp.eval(`(() => ({
    frame: document.querySelectorAll('[data-qc-command-frame="prestige-v1"]').length,
    portraits: [...document.images].filter(img => (img.alt || '').includes('Queen Califia') && img.getClientRects().length > 0).length,
    probe: window.__fleetAudioProbe
  }))()`);
  if (command.frame < 1 || command.portraits < 1 || command.probe.oscillators !== mutedBefore)
    fail("QC command handoff/mute contract failed", { mutedBefore, command });

  const desktopLayout = await layout(cdp);
  await capture(cdp, "qc-desktop");

  await setMobile(cdp);
  await setMotion(cdp, "reduce");
  await navigate(cdp, config.url);
  const reduced = await cdp.eval(`(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    awakening: document.querySelectorAll('.qc-sovereign-awakening').length,
    scan: document.querySelectorAll('.qc-awaken-holo-scan').length,
    command: document.querySelectorAll('[data-qc-command-frame="prestige-v1"]').length,
    probe: window.__fleetAudioProbe,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src)
  }))()`);
  if (
    !reduced.media || reduced.awakening !== 0 || reduced.scan !== 0 || reduced.command < 1 ||
    reduced.probe?.contexts !== 0 || reduced.probe?.oscillators !== 0 || reduced.overflow > 1 || reduced.broken.length
  ) fail("QC reduced-motion/mobile contract failed", reduced);
  await capture(cdp, "qc-mobile-reduced");
  const issues = assertNoCriticalRuntimeIssues(name, issueStart);
  return { initial, motion: { before: initial.scanTop, after: scanTopAfter }, linking, enabled, authority, command, desktopLayout, reduced, runtimeIssues: issues };
}

async function auditTechBridge(cdp) {
  const name = "techbridge";
  const config = SITES[name];
  activeSite = name;
  activeOrigin = new URL(config.url).origin;
  const issueStart = runtimeIssues.length;
  await setDesktop(cdp);
  await setMotion(cdp, "no-preference");
  await navigate(cdp, config.url);
  await cdp.eval(`sessionStorage.setItem('techbridge:intro-seen:v2', '1'); location.reload(); true`);
  await sleep(1500);

  const initial = await cdp.eval(`(() => ({
    state: document.querySelector('[data-techbridge-sound]')?.dataset.techbridgeSound,
    pressed: document.querySelector('[data-techbridge-sound]')?.getAttribute('aria-pressed'),
    probe: window.__fleetAudioProbe,
    favicon: document.querySelector('link[rel~="icon"]')?.href || null,
    hkLauncher: document.querySelectorAll('[data-hk-launcher="true"]').length
  }))()`);
  if (
    initial.state !== "off" || initial.pressed !== "false" ||
    initial.probe?.contexts !== 0 || initial.probe?.oscillators !== 0 ||
    !initial.favicon?.endsWith("/favicon.svg") || initial.hkLauncher < 1
  ) fail("TechBridge initial contract failed", initial);

  await cdp.eval(`document.querySelector('[data-techbridge-sound]')?.click(); true`);
  await sleep(160);
  const waveformBefore = await cdp.eval(`getComputedStyle(document.querySelector('[data-techbridge-sound] > div > div')).height`);
  await sleep(230);
  const waveformAfter = await cdp.eval(`getComputedStyle(document.querySelector('[data-techbridge-sound] > div > div')).height`);
  const enabled = await cdp.eval(`(() => ({ state: document.querySelector('[data-techbridge-sound]')?.dataset.techbridgeSound, probe: window.__fleetAudioProbe }))()`);
  if (enabled.state !== "on" || enabled.probe?.contexts < 1 || enabled.probe?.oscillators < 1 || waveformBefore === waveformAfter)
    fail("TechBridge opt-in/waveform contract failed", { waveformBefore, waveformAfter, enabled });

  const beforeHK = enabled.probe.oscillators;
  await cdp.eval(`document.querySelector('[data-hk-launcher="true"]')?.click(); true`);
  await sleep(350);
  const hk = await cdp.eval(`(() => ({
    oscillators: window.__fleetAudioProbe.oscillators,
    visibleImages: [...document.images].filter(img => /H\\.K\\.|Horace King/i.test(img.alt || '') && img.getClientRects().length > 0).length,
    text: (document.body?.innerText || '').includes('H.K.')
  }))()`);
  if (hk.oscillators <= beforeHK || !hk.text)
    fail("TechBridge H.K. interaction/SFX failed", { beforeHK, hk });

  await cdp.eval(`document.querySelector('[data-techbridge-sound]')?.click(); true`);
  await sleep(300);
  const mutedBefore = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  await cdp.eval(`document.querySelector('[data-hk-launcher="true"]')?.click(); true`);
  await sleep(300);
  const mutedAfter = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  if (mutedAfter !== mutedBefore) fail("TechBridge mute failed", { mutedBefore, mutedAfter });

  const desktopLayout = await layout(cdp);
  await capture(cdp, "techbridge-desktop");

  await setMobile(cdp);
  await setMotion(cdp, "reduce");
  await cdp.eval(`sessionStorage.removeItem('techbridge:intro-seen:v2'); location.reload(); true`);
  await sleep(1500);
  const reduced = await cdp.eval(`(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    remembered: sessionStorage.getItem('techbridge:intro-seen:v2'),
    sound: document.querySelector('[data-techbridge-sound]')?.dataset.techbridgeSound,
    probe: window.__fleetAudioProbe,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src)
  }))()`);
  if (
    !reduced.media || reduced.remembered !== "1" || reduced.sound !== "off" ||
    reduced.probe?.contexts !== 0 || reduced.probe?.oscillators !== 0 || reduced.overflow > 1 || reduced.broken.length
  ) fail("TechBridge reduced-motion/mobile contract failed", reduced);
  await capture(cdp, "techbridge-mobile-reduced");
  const issues = assertNoCriticalRuntimeIssues(name, issueStart);
  return { initial, enabled, waveform: { before: waveformBefore, after: waveformAfter }, hk: { before: beforeHK, ...hk }, muted: { before: mutedBefore, after: mutedAfter }, desktopLayout, reduced, runtimeIssues: issues };
}

async function auditTamerian(cdp) {
  const name = "tamerian";
  const config = SITES[name];
  activeSite = name;
  activeOrigin = new URL(config.url).origin;
  const issueStart = runtimeIssues.length;
  await setDesktop(cdp);
  await setMotion(cdp, "no-preference");
  await navigate(cdp, config.url);
  await cdp.eval(`sessionStorage.removeItem('tamerian-intro-complete-v1'); location.reload(); true`);
  await sleep(700);

  const intro = await cdp.eval(`(() => ({
    present: !!document.querySelector('[aria-label="Tamerian cinematic introduction"]'),
    probe: window.__fleetAudioProbe,
    raf: window.__fleetMotionProbe?.callbacks || 0
  }))()`);
  await sleep(300);
  const rafAfter = await cdp.eval(`window.__fleetMotionProbe?.callbacks || 0`);
  if (!intro.present || intro.probe?.contexts !== 0 || intro.probe?.oscillators !== 0 || rafAfter <= intro.raf)
    fail("Tamerian cinematic consent/motion contract failed", { intro, rafAfter });

  await cdp.eval(`sessionStorage.setItem('tamerian-intro-complete-v1','true'); location.reload(); true`);
  await sleep(1400);
  const initial = await cdp.eval(`(() => ({
    state: document.querySelector('[data-tamerian-sound]')?.dataset.tamerianSound,
    pressed: document.querySelector('[data-tamerian-sound]')?.getAttribute('aria-pressed'),
    label: document.querySelector('[data-tamerian-sound]')?.getAttribute('aria-label'),
    probe: window.__fleetAudioProbe,
    favicon: document.querySelector('link[rel~="icon"]')?.href || null
  }))()`);
  if (
    initial.state !== "off" || initial.pressed !== "false" || initial.label !== "Enable sounds" ||
    initial.probe?.contexts !== 0 || initial.probe?.oscillators !== 0 || !initial.favicon
  ) fail("Tamerian initial contract failed", initial);

  await cdp.eval(`document.querySelector('[data-tamerian-sound]')?.click(); true`);
  await sleep(450);
  const enabled = await cdp.eval(`(() => ({
    state: document.querySelector('[data-tamerian-sound]')?.dataset.tamerianSound,
    pressed: document.querySelector('[data-tamerian-sound]')?.getAttribute('aria-pressed'),
    label: document.querySelector('[data-tamerian-sound]')?.getAttribute('aria-label'),
    probe: window.__fleetAudioProbe
  }))()`);
  if (enabled.state !== "on" || enabled.pressed !== "true" || enabled.label !== "Mute sounds" || enabled.probe?.contexts < 1 || enabled.probe?.oscillators < 1)
    fail("Tamerian explicit opt-in failed", enabled);

  const beforeHover = enabled.probe.oscillators;
  const point = await movePointerTo(cdp, `nav a[href="#tech"]`);
  await sleep(250);
  const afterHover = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  if (afterHover <= beforeHover) fail("Tamerian hover SFX missing", { beforeHover, afterHover });

  await cdp.eval(`document.querySelector('[data-tamerian-sound]')?.click(); true`);
  await sleep(300);
  const mutedBefore = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1, y: 1 });
  await sleep(80);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x, y: point.y });
  await sleep(250);
  const mutedAfter = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  if (mutedAfter !== mutedBefore) fail("Tamerian mute failed", { mutedBefore, mutedAfter });

  const desktopLayout = await layout(cdp);
  await capture(cdp, "tamerian-desktop");

  await setMobile(cdp);
  await setMotion(cdp, "reduce");
  await cdp.eval(`sessionStorage.removeItem('tamerian-intro-complete-v1'); location.reload(); true`);
  await sleep(1200);
  const reduced = await cdp.eval(`(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    remembered: sessionStorage.getItem('tamerian-intro-complete-v1'),
    intro: !!document.querySelector('[aria-label="Tamerian cinematic introduction"]'),
    introCanvas: !!document.querySelector('[aria-label="Tamerian cinematic introduction"] canvas'),
    sound: document.querySelector('[data-tamerian-sound]')?.dataset.tamerianSound,
    probe: window.__fleetAudioProbe,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src)
  }))()`);
  if (
    !reduced.media || reduced.remembered !== null || reduced.intro || reduced.introCanvas ||
    reduced.sound !== "off" || reduced.probe?.contexts !== 0 || reduced.probe?.oscillators !== 0 ||
    reduced.overflow > 1 || reduced.broken.length
  ) fail("Tamerian reduced-motion/mobile contract failed", reduced);
  await capture(cdp, "tamerian-mobile-reduced");
  const issues = assertNoCriticalRuntimeIssues(name, issueStart);
  return { intro: { ...intro, rafAfter }, initial, enabled, hover: { before: beforeHover, after: afterHover }, muted: { before: mutedBefore, after: mutedAfter }, desktopLayout, reduced, runtimeIssues: issues };
}

async function auditPeoples(cdp) {
  const name = "peoples";
  const config = SITES[name];
  activeSite = name;
  activeOrigin = new URL(config.url).origin;
  const issueStart = runtimeIssues.length;
  await setDesktop(cdp);
  await setMotion(cdp, "no-preference");
  await navigate(cdp, config.url);
  await cdp.eval(`sessionStorage.clear(); localStorage.clear(); location.reload(); true`);
  await sleep(950);

  const introStart = await cdp.eval(`(() => ({
    probe: window.__fleetAudioProbe,
    motion: window.__fleetMotionProbe,
    introStep: document.querySelector('[data-peoples-intro-step]')?.dataset.peoplesIntroStep,
    canvas: !!document.querySelector('[data-peoples-intro-step] canvas'),
    mounted: document.documentElement.dataset.peoplesAppMounted,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
  }))()`);
  if (
    introStart.probe?.contexts !== 0 || introStart.probe?.oscillators !== 0 ||
    !["1", "2"].includes(introStart.introStep) || introStart.mounted !== "true" || introStart.overflow > 1
  ) fail("Peoples intro contract failed", introStart);
  const rafBefore = introStart.motion?.callbacks || 0;
  await sleep(300);
  const rafAfter = await cdp.eval(`window.__fleetMotionProbe?.callbacks || 0`);
  if (introStart.canvas && rafAfter <= rafBefore)
    fail("Peoples intro motion did not advance", { rafBefore, rafAfter });

  const skipped = await cdp.eval(`(() => {
    const button = document.querySelector('button[aria-label="Skip the opening sequence"]');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!skipped) fail("Peoples visible Skip intro control missing");
  await waitForEval(cdp, `!!document.querySelector('[data-peoples-sound]')`, 80, 100);
  await sleep(180);
  const initial = await cdp.eval(`(() => ({
    state: document.querySelector('[data-peoples-sound]')?.dataset.peoplesSound,
    pressed: document.querySelector('[data-peoples-sound]')?.getAttribute('aria-pressed'),
    probe: window.__fleetAudioProbe,
    mounted: document.documentElement.dataset.peoplesAppMounted
  }))()`);
  if (initial.state !== "off" || initial.pressed !== "false" || initial.probe?.contexts !== 0 || initial.probe?.oscillators !== 0 || initial.mounted !== "true")
    fail("Peoples initial sound contract failed", initial);

  await cdp.eval(`document.querySelector('[data-peoples-sound]')?.click(); true`);
  await sleep(250);
  const enabled = await cdp.eval(`(() => ({ state: document.querySelector('[data-peoples-sound]')?.dataset.peoplesSound, probe: window.__fleetAudioProbe }))()`);
  if (enabled.state !== "on" || enabled.probe?.contexts < 1 || enabled.probe?.oscillators < 1)
    fail("Peoples explicit opt-in failed", enabled);

  const beforeNav = enabled.probe.oscillators;
  const navClicked = await cdp.eval(`(() => {
    const button = [...document.querySelectorAll('nav button')].find(button => (button.textContent || '').includes('3D GALLERY'));
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!navClicked) fail("Peoples 3D Gallery navigation control missing");
  await sleep(650);
  const afterNav = await cdp.eval(`(() => ({ path: location.pathname, probe: window.__fleetAudioProbe }))()`);
  if (!afterNav.path.endsWith("/gallery") || afterNav.probe.oscillators <= beforeNav)
    fail("Peoples navigation route/SFX failed", { beforeNav, afterNav });

  await cdp.eval(`document.querySelector('[data-peoples-sound]')?.click(); true`);
  await sleep(150);
  const mutedBefore = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  const hkClicked = await cdp.eval(`(() => {
    const button = document.querySelector('button[aria-label="Open H.K. Assistant"]');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!hkClicked) fail("Peoples H.K. launcher missing");
  await sleep(300);
  const mutedAfter = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  if (mutedAfter !== mutedBefore) fail("Peoples mute/H.K. suppression failed", { mutedBefore, mutedAfter });

  const desktopLayout = await layout(cdp);
  await capture(cdp, "peoples-desktop");

  await setMobile(cdp);
  await setMotion(cdp, "reduce");
  await navigate(cdp, config.url);
  await sleep(250);
  const reduced = await cdp.eval(`(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    intro: !!document.querySelector('[data-peoples-intro-step]'),
    canvas: !!document.querySelector('[data-peoples-intro-step] canvas'),
    sound: document.querySelector('[data-peoples-sound]')?.dataset.peoplesSound,
    probe: window.__fleetAudioProbe,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src)
  }))()`);
  if (
    !reduced.media || reduced.canvas || reduced.probe?.contexts !== 0 || reduced.probe?.oscillators !== 0 ||
    reduced.overflow > 1 || reduced.broken.length
  ) fail("Peoples reduced-motion/mobile intro contract failed", reduced);
  if (reduced.intro) {
    await cdp.eval(`document.querySelector('button[aria-label="Skip the opening sequence"]')?.click(); true`);
    await waitForEval(cdp, `!!document.querySelector('[data-peoples-sound]')`, 80, 100);
    await sleep(150);
  }
  const reducedApp = await cdp.eval(`(() => ({
    sound: document.querySelector('[data-peoples-sound]')?.dataset.peoplesSound,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src)
  }))()`);
  if (reducedApp.sound !== "off" || reducedApp.overflow > 1 || reducedApp.broken.length)
    fail("Peoples reduced-motion/mobile app contract failed", reducedApp);
  await capture(cdp, "peoples-mobile-reduced");
  const issues = assertNoCriticalRuntimeIssues(name, issueStart);
  return { introStart, motion: { before: rafBefore, after: rafAfter }, initial, enabled, navigation: { before: beforeNav, after: afterNav }, muted: { before: mutedBefore, after: mutedAfter }, desktopLayout, reduced, reducedApp, runtimeIssues: issues };
}

async function auditBlueGold(cdp) {
  const name = "bluegold";
  const config = SITES[name];
  activeSite = name;
  activeOrigin = new URL(config.url).origin;
  const issueStart = runtimeIssues.length;
  await setDesktop(cdp);
  await setMotion(cdp, "no-preference");
  await navigate(cdp, config.url);
  await cdp.eval(`localStorage.clear(); sessionStorage.clear(); location.reload(); true`);
  await sleep(1000);
  const initial = await cdp.eval(`(() => {
    const button = document.querySelector('[data-bluegold-sound]');
    const cue = document.querySelector('.cue');
    return {
      sound: button?.dataset.bluegoldSound,
      pressed: button?.getAttribute('aria-pressed'),
      probe: window.__fleetAudioProbe,
      favicon: document.querySelector('link[rel~="icon"]')?.href || null,
      motion: cue ? getComputedStyle(cue, '::after').animationName : null,
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
    };
  })()`);
  if (
    initial.sound !== "off" || initial.pressed !== "false" || initial.probe?.contexts !== 0 || initial.probe?.oscillators !== 0 ||
    !initial.favicon?.endsWith("/assets/favicon.svg") || initial.motion !== "drip" || initial.overflow > 1
  ) fail("Blue-Gold initial contract failed", initial);

  await cdp.eval(`document.querySelector('[data-bluegold-sound]')?.click(); true`);
  await sleep(250);
  const enabled = await cdp.eval(`(() => ({ sound: document.querySelector('[data-bluegold-sound]')?.dataset.bluegoldSound, probe: window.__fleetAudioProbe }))()`);
  if (enabled.sound !== "on" || enabled.probe?.contexts < 1 || enabled.probe?.oscillators < 3)
    fail("Blue-Gold explicit opt-in failed", enabled);

  const beforeHover = enabled.probe.oscillators;
  await cdp.eval(`document.querySelector('.nav .links a')?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true })); true`);
  await sleep(180);
  const afterHover = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  if (afterHover <= beforeHover) fail("Blue-Gold hover cue missing", { beforeHover, afterHover });

  await cdp.eval(`document.querySelector('[data-bluegold-sound]')?.click(); true`);
  await sleep(150);
  const mutedBefore = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  await cdp.eval(`document.querySelector('.nav .links a')?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true })); true`);
  await sleep(180);
  const mutedAfter = await cdp.eval(`window.__fleetAudioProbe.oscillators`);
  if (mutedAfter !== mutedBefore) fail("Blue-Gold mute failed", { mutedBefore, mutedAfter });

  const desktopLayout = await layout(cdp);
  await capture(cdp, "bluegold-desktop");

  await setMobile(cdp);
  await setMotion(cdp, "reduce");
  await navigate(cdp, config.url);
  const reduced = await cdp.eval(`(() => {
    const rv = document.querySelector('.rv');
    return {
      media: matchMedia('(prefers-reduced-motion: reduce)').matches,
      sound: document.querySelector('[data-bluegold-sound]')?.dataset.bluegoldSound,
      rvOpacity: rv ? getComputedStyle(rv).opacity : null,
      probe: window.__fleetAudioProbe,
      broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src),
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
    };
  })()`);
  if (
    !reduced.media || reduced.sound !== "off" || reduced.rvOpacity !== "1" ||
    reduced.probe?.contexts !== 0 || reduced.probe?.oscillators !== 0 || reduced.broken.length || reduced.overflow > 1
  ) fail("Blue-Gold reduced-motion/mobile contract failed", reduced);
  await capture(cdp, "bluegold-mobile-reduced");
  const issues = assertNoCriticalRuntimeIssues(name, issueStart);
  return { initial, enabled, hover: { before: beforeHover, after: afterHover }, muted: { before: mutedBefore, after: mutedAfter }, desktopLayout, reduced, runtimeIssues: issues };
}

async function runSite(name, fn, cdp) {
  try {
    report.sites[name] = { status: "passed", ...(await fn(cdp)) };
    console.log(`LIVE_${name.toUpperCase()}=PASS`);
  } catch (error) {
    const failure = {
      site: name,
      message: error.message,
      detail: error.detail ?? null,
    };
    report.failures.push(failure);
    report.sites[name] = { status: "failed", failure };
    console.error(`LIVE_${name.toUpperCase()}=FAIL`, JSON.stringify(failure));
  }
}

let cdp;
try {
  await preflight();
  await waitForHttp(`${CDP_HTTP}/json/version`);
  const targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
  const target = targets.find(item => item.type === "page");
  if (!target?.webSocketDebuggerUrl) fail("No Chrome page target");
  cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const Native = window.AudioContext || window.webkitAudioContext;
      window.__fleetAudioProbe = { contexts: 0, oscillators: 0 };
      if (Native) {
        const Wrapped = new Proxy(Native, {
          construct(Target, args) {
            const ctx = new Target(...args);
            window.__fleetAudioProbe.contexts++;
            const nativeOscillator = ctx.createOscillator.bind(ctx);
            ctx.createOscillator = (...oscArgs) => {
              window.__fleetAudioProbe.oscillators++;
              return nativeOscillator(...oscArgs);
            };
            return ctx;
          }
        });
        window.AudioContext = Wrapped;
        if (window.webkitAudioContext) window.webkitAudioContext = Wrapped;
      }
      const nativeRaf = window.requestAnimationFrame.bind(window);
      window.__fleetMotionProbe = { callbacks: 0 };
      window.requestAnimationFrame = callback => nativeRaf(time => {
        window.__fleetMotionProbe.callbacks++;
        return callback(time);
      });
    })();`,
  });

  await fs.mkdir("live-experience-evidence", { recursive: true });
  await runSite("qc", auditQC, cdp);
  await runSite("techbridge", auditTechBridge, cdp);
  await runSite("tamerian", auditTamerian, cdp);
  await runSite("peoples", auditPeoples, cdp);
  await runSite("bluegold", auditBlueGold, cdp);
} catch (error) {
  report.failures.push({ site: "harness", message: error.message, detail: error.detail ?? null });
  console.error("LIVE_FLEET_HARNESS=FAIL", error);
} finally {
  activeSite = null;
  activeOrigin = null;
  cdp?.close();
  report.runtimeIssues = runtimeIssues;
  report.finishedAt = new Date().toISOString();
  report.failureCount = report.failures.length;
  await fs.mkdir("live-experience-evidence", { recursive: true });
  await fs.writeFile(
    "live-experience-evidence/live-experience-wave.json",
    JSON.stringify(report, null, 2)
  );
  console.log("LIVE_EXPERIENCE_WAVE_SUMMARY", JSON.stringify({ failures: report.failureCount, sites: Object.fromEntries(Object.entries(report.sites).map(([name, value]) => [name, value.status])) }));
  if (report.failureCount) process.exitCode = 1;
}
