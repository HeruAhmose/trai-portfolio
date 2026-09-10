import { writeFileSync } from "node:fs";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const cdpEndpoint = "http://127.0.0.1:9222";
const reportPath = "/tmp/trai-experience-audit.json";
const allowedBaseUrls = new Set([
  "http://127.0.0.1:4173/trai-portfolio/",
  "https://heruahmose.github.io/trai-portfolio/",
]);

const report = { startedAt: new Date().toISOString(), checks: [], failures: [] };
let socket;
let sequence = 0;
const pending = new Map();

function fail(check, message, detail) {
  report.failures.push({ check, message, ...(detail === undefined ? {} : { detail }) });
}

function send(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result?.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Evaluation failed");
  }
  return result?.result?.value;
}

async function waitFor(label, expression, timeout = 12000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await sleep(125);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function trustedClick(selector) {
  const raw = await evaluate(`JSON.stringify((() => {
    const node = document.querySelector(${JSON.stringify(selector)});
    if (!node || !node.getClientRects().length) return null;
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })())`);
  const point = raw && JSON.parse(raw);
  if (!point) throw new Error(`Visible click target missing: ${selector}`);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x, y: point.y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 });
}

async function trustedClickButton(label) {
  const selector = `button[data-audit-target=${JSON.stringify(label)}]`;
  const installed = await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')].find(node => node.textContent?.trim() === ${JSON.stringify(label)} && node.getClientRects().length > 0);
    if (!button) return false;
    button.dataset.auditTarget = ${JSON.stringify(label)};
    return true;
  })()`);
  if (!installed) throw new Error(`Visible button missing: ${label}`);
  await trustedClick(selector);
}

async function navigate(url) {
  const result = await send("Page.navigate", { url });
  if (result?.errorText) throw new Error(result.errorText);
  await waitFor("React root", `document.readyState === 'complete' && (document.getElementById('root')?.childElementCount || 0) > 0`);
  await sleep(250);
}

async function main() {
  let target;
  for (let i = 0; i < 40; i++) {
    const targets = await fetch(`${cdpEndpoint}/json`).then(r => r.json());
    target = targets.find(candidate => candidate.type === "page" && candidate.webSocketDebuggerUrl && allowedBaseUrls.has(new URL(candidate.url).href));
    if (target) break;
    await sleep(250);
  }
  if (!target?.webSocketDebuggerUrl) throw new Error("Allowlisted TRAI browser target not found");
  const baseUrl = new URL(target.url).href;
  report.baseUrl = baseUrl;

  socket = new WebSocket(target.webSocketDebuggerUrl);
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    message.error ? waiter.reject(new Error(JSON.stringify(message.error))) : waiter.resolve(message.result);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setTouchEmulationEnabled", { enabled: false });
  await send("Emulation.setEmulatedMedia", { media: "screen", features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });

  // Establish a deterministic fresh-visitor sound state.
  await navigate(baseUrl);
  await evaluate(`localStorage.removeItem('soundPreferences'); location.reload()`);
  await waitFor("fresh ceremonial intro", `Boolean(document.querySelector('[role="dialog"][aria-label="TRAI ceremonial introduction"]'))`);
  await waitFor("sound preferences hydration", `document.querySelector('[data-ceremonial-sound]')?.dataset.ceremonialSound === 'off'`);
  await evaluate(`window.__traiSfxEvents = []; window.addEventListener('trai:sfx', event => window.__traiSfxEvents.push(event.detail));`);

  const initial = JSON.parse(await evaluate(`JSON.stringify({
    introSound: document.querySelector('[data-ceremonial-sound]')?.dataset.ceremonialSound,
    globalEnabled: document.querySelector('[data-sovereign-audio-control]')?.dataset.audioEnabled,
    introToggle: document.querySelector('[data-intro-sound-toggle]')?.textContent?.trim(),
    routeMotion: Boolean(document.querySelector('[data-sovereign-route-motion="true"]')),
    protocolTransition: typeof window.TRAIOrganismV5?.transitionInternal
  })`));
  if (initial.introSound !== "off" || initial.globalEnabled !== "false" || initial.introToggle !== "Enable sound") {
    fail("audio opt-in", "Fresh visitor did not start truthfully silent", initial);
  }
  if (!initial.routeMotion || initial.protocolTransition !== "function") {
    fail("motion runtime", "Route/protocol transition layer is not active", initial);
  }

  await trustedClick('[data-intro-sound-toggle="true"]');
  await waitFor("sound opt-in", `document.querySelector('[data-ceremonial-sound]')?.dataset.ceremonialSound === 'on'`);
  await waitFor("ambient engine enabled", `document.querySelector('[data-sovereign-audio-control]')?.dataset.audioEnabled === 'true'`);
  await waitFor("ambient engine initialized", `document.querySelector('[data-sovereign-audio-control]')?.dataset.audioInitialized === 'true'`);
  await waitFor("AudioContext running", `document.querySelector('[data-sovereign-audio-control]')?.dataset.audioContextState === 'running'`, 8000);

  await trustedClickButton("Continue");
  await waitFor("audible navigation SFX scheduling", `(window.__traiSfxEvents || []).some(event => event.type === 'navigate')`);
  const enabledState = JSON.parse(await evaluate(`JSON.stringify({
    enabled: document.querySelector('[data-sovereign-audio-control]')?.dataset.audioEnabled,
    initialized: document.querySelector('[data-sovereign-audio-control]')?.dataset.audioInitialized,
    context: document.querySelector('[data-sovereign-audio-control]')?.dataset.audioContextState,
    events: window.__traiSfxEvents || []
  })`));
  report.checks.push({ check: "audio opt-in + SFX", status: "passed", ...enabledState });

  await trustedClick('[data-intro-sound-toggle="true"]');
  await waitFor("sound mute", `document.querySelector('[data-ceremonial-sound]')?.dataset.ceremonialSound === 'off'`);
  await evaluate(`window.__traiSfxEvents = []`);
  await trustedClickButton("Continue");
  await sleep(400);
  const mutedEvents = JSON.parse(await evaluate(`JSON.stringify(window.__traiSfxEvents || [])`));
  if (mutedEvents.length) fail("audio mute", "SFX escaped the muted master state", mutedEvents);
  report.checks.push({ check: "audio mute authority", status: mutedEvents.length ? "failed" : "passed", events: mutedEvents });

  await trustedClick('[data-intro-sound-toggle="true"]');
  await waitFor("sound re-enable", `document.querySelector('[data-ceremonial-sound]')?.dataset.ceremonialSound === 'on'`);
  await evaluate(`window.__traiSfxEvents = []`);
  await trustedClickButton("Enter TRAI");
  await waitFor("intro handoff", `!document.querySelector('[role="dialog"][aria-label="TRAI ceremonial introduction"]')`);
  await waitFor("final transition SFX", `(window.__traiSfxEvents || []).some(event => event.type === 'navigate' || event.type === 'chime')`);

  const finePointer = await evaluate(`matchMedia('(pointer: fine)').matches`);
  if (finePointer) {
    await waitFor("sovereign pointer halo", `Boolean(document.querySelector('[data-sovereign-cursor="true"]'))`);
  }
  const motionState = JSON.parse(await evaluate(`JSON.stringify({
    finePointer: matchMedia('(pointer: fine)').matches,
    cursor: Boolean(document.querySelector('[data-sovereign-cursor="true"]')),
    reduced: document.querySelector('[data-sovereign-route-motion]')?.dataset.motionReduced,
    route: document.querySelector('[data-sovereign-route-motion]')?.getAttribute('data-sovereign-route-motion'),
    soundLabel: document.querySelector('[data-navigation-sound-toggle]')?.getAttribute('aria-label')
  })`));
  if (motionState.reduced !== "false") fail("motion runtime", "Normal-motion route incorrectly marked reduced", motionState);
  if (motionState.finePointer && !motionState.cursor) fail("pointer runtime", "Fine-pointer halo did not mount", motionState);
  if (motionState.soundLabel !== "Mute sound") fail("audio control", "Navigation sound control is not synchronized", motionState);
  report.checks.push({ check: "active prestige motion", status: report.failures.some(f => ["motion runtime", "pointer runtime", "audio control"].includes(f.check)) ? "failed" : "passed", ...motionState });

  // Reduced-motion contract: route animation declares the reduced state and the
  // decorative pointer halo is absent.
  await send("Emulation.setEmulatedMedia", { media: "screen", features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await navigate(new URL("melanina/", baseUrl).href);
  await waitFor("reduced-motion route", `document.querySelector('[data-sovereign-route-motion]')?.dataset.motionReduced === 'true'`);
  await sleep(250);
  const reduced = JSON.parse(await evaluate(`JSON.stringify({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    marker: document.querySelector('[data-sovereign-route-motion]')?.dataset.motionReduced,
    cursor: Boolean(document.querySelector('[data-sovereign-cursor="true"]')),
    overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    collectionImage: Boolean([...document.images].find(image => /MeLaNiNa Collection 001/.test(image.alt) && image.complete && image.naturalWidth > 0))
  })`));
  if (!reduced.media || reduced.marker !== "true" || reduced.cursor || reduced.overflow > 2 || !reduced.collectionImage) {
    fail("reduced motion", "Reduced-motion experience contract failed", reduced);
  }
  report.checks.push({ check: "reduced-motion experience", status: report.failures.some(f => f.check === "reduced motion") ? "failed" : "passed", ...reduced });

  report.finishedAt = new Date().toISOString();
  report.summary = { checks: report.checks.length, failures: report.failures.length };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report.summary));
  if (report.failures.length) {
    console.error(JSON.stringify(report.failures, null, 2));
    process.exitCode = 1;
  }
  socket.close();
}

try {
  await main();
} catch (error) {
  report.finishedAt = new Date().toISOString();
  fail("harness", "Experience audit failed", String(error?.stack || error));
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 1;
  socket?.close();
}
