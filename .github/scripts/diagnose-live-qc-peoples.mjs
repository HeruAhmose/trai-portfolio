import fs from "node:fs/promises";

const CDP_HTTP = "http://127.0.0.1:9251";
const QC_URL = "https://heruahmose.github.io/QueenCalifia-CyberAI/";
const PEOPLES_URL = "https://heruahmose.github.io/peoples-portfolio/";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class CDP {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
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
      }
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

async function waitForHttp(url, attempts = 240) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {}
    await sleep(250);
  }
  throw new Error(`timeout waiting for ${url}`);
}

async function waitForEval(cdp, expression, attempts = 100, delay = 100) {
  for (let i = 0; i < attempts; i++) {
    if (await cdp.eval(expression)) return true;
    await sleep(delay);
  }
  throw new Error(`timeout waiting for ${expression}`);
}

async function setDesktop(cdp) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: false });
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
}

async function navigate(cdp, url, pause = 1000) {
  const result = await cdp.send("Page.navigate", { url });
  if (result?.errorText) throw new Error(result.errorText);
  await waitForEval(
    cdp,
    `document.readyState === 'complete' && (document.body?.innerText || '').length > 20`,
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
  if (!clicked) throw new Error(`visible button not found: ${text}`);
}

async function diagnoseQC(cdp) {
  await setDesktop(cdp);
  await navigate(cdp, QC_URL);
  await cdp.eval(`localStorage.removeItem('qc_audio_enabled'); location.reload(); true`);
  await sleep(1300);

  await clickText(cdp, "AWAKEN SOVEREIGN INTELLIGENCE");
  await waitForEval(
    cdp,
    `[...document.querySelectorAll('button')].some(button => (button.textContent || '').includes('ENTER COMMAND FIELD'))`,
    50,
    100
  );
  await cdp.eval(`document.querySelector('[data-qc-sound]')?.click(); true`);
  await sleep(350);
  await cdp.eval(`document.querySelector('[data-qc-sound]')?.click(); true`);
  await sleep(200);
  const beforeOsc = await cdp.eval(`window.__diagAudioProbe?.oscillators || 0`);
  await clickText(cdp, "ENTER COMMAND FIELD");

  const timeline = [];
  for (let index = 0; index < 30; index++) {
    timeline.push(
      await cdp.eval(`(() => ({
        t: ${index * 100},
        awakening: document.querySelectorAll('.qc-sovereign-awakening').length,
        commandFrame: document.querySelectorAll('[data-qc-command-frame="prestige-v1"]').length,
        images: [...document.images]
          .filter(img => /Queen Califia/i.test(img.alt || ''))
          .map(img => {
            const rect = img.getBoundingClientRect();
            const style = getComputedStyle(img);
            return {
              alt: img.alt,
              src: img.getAttribute('src'),
              complete: img.complete,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              opacity: style.opacity,
              display: style.display,
              visibility: style.visibility,
              rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
              clientRects: img.getClientRects().length
            };
          }),
        oscillators: window.__diagAudioProbe?.oscillators || 0,
        bodyTextHasQueen: (document.body?.innerText || '').includes('Queen Califia')
      }))()`)
    );
    await sleep(100);
  }

  const visibleAt = timeline.find(entry =>
    entry.commandFrame > 0 &&
    entry.images.some(img =>
      img.complete &&
      img.naturalWidth > 0 &&
      Number(img.opacity) > 0 &&
      img.clientRects > 0 &&
      img.rect.width > 0 &&
      img.rect.height > 0
    )
  );
  const afterOsc = timeline.at(-1)?.oscillators ?? -1;
  return {
    beforeOsc,
    afterOsc,
    muteHeld: beforeOsc === afterOsc,
    visibleAtMs: visibleAt?.t ?? null,
    visibleAt: visibleAt ?? null,
    timeline,
  };
}

async function diagnosePeoples(cdp) {
  await setDesktop(cdp);
  await navigate(cdp, PEOPLES_URL);
  await cdp.eval(`sessionStorage.clear(); localStorage.clear(); location.reload(); true`);
  await sleep(1000);
  await waitForEval(cdp, `!!document.querySelector('button[aria-label="Skip the opening sequence"]')`, 80, 100);
  await cdp.eval(`document.querySelector('button[aria-label="Skip the opening sequence"]')?.click(); true`);
  await waitForEval(cdp, `!!document.querySelector('[data-peoples-sound]')`, 80, 100);
  await sleep(150);
  const clicked = await cdp.eval(`(() => {
    const button = [...document.querySelectorAll('nav button')].find(button => (button.textContent || '').includes('3D GALLERY'));
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error("3D GALLERY control missing");
  await waitForEval(cdp, `location.pathname.endsWith('/gallery')`, 80, 100);
  await sleep(650);

  return cdp.eval(`(async () => {
    const samples = [];
    const maxHeight = Math.min(
      Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0),
      24000
    );
    const step = Math.max(240, Math.floor(window.innerHeight * 0.55));
    let maxOverflow = 0;
    for (let y = 0; y <= maxHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 70));
      const root = document.documentElement;
      const overflow = Math.max(0, root.scrollWidth - root.clientWidth);
      maxOverflow = Math.max(maxOverflow, overflow);
      if (overflow > 1) {
        const viewportWidth = root.clientWidth;
        const offenders = [...document.querySelectorAll('body *')]
          .map((element, index) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const rightExcess = Math.max(0, rect.right - viewportWidth);
            const leftExcess = Math.max(0, -rect.left);
            if (rightExcess <= 1 && leftExcess <= 1) return null;
            return {
              index,
              tag: element.tagName,
              id: element.id || null,
              className: typeof element.className === 'string' ? element.className.slice(0, 180) : null,
              aria: element.getAttribute('aria-label'),
              text: (element.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 120),
              rect: {
                left: Number(rect.left.toFixed(2)),
                right: Number(rect.right.toFixed(2)),
                width: Number(rect.width.toFixed(2)),
                top: Number(rect.top.toFixed(2)),
                bottom: Number(rect.bottom.toFixed(2))
              },
              excess: Number(Math.max(rightExcess, leftExcess).toFixed(2)),
              position: style.position,
              transform: style.transform,
              width: style.width,
              maxWidth: style.maxWidth,
              overflowX: style.overflowX
            };
          })
          .filter(Boolean)
          .sort((a, b) => b.excess - a.excess)
          .slice(0, 25);
        samples.push({
          y,
          overflow,
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          innerWidth: window.innerWidth,
          bodyWidth: document.body?.getBoundingClientRect().width || null,
          offenders
        });
      }
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      maxOverflow,
      finalOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      samples
    };
  })()`);
}

await waitForHttp(`${CDP_HTTP}/json/version`);
const targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
const target = targets.find(item => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("no Chrome page target");
const cdp = new CDP(target.webSocketDebuggerUrl);
await cdp.open();
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
  source: `(() => {
    const Native = window.AudioContext || window.webkitAudioContext;
    window.__diagAudioProbe = { contexts: 0, oscillators: 0 };
    if (Native) {
      const Wrapped = new Proxy(Native, {
        construct(Target, args) {
          const ctx = new Target(...args);
          window.__diagAudioProbe.contexts++;
          const nativeOscillator = ctx.createOscillator.bind(ctx);
          ctx.createOscillator = (...oscArgs) => {
            window.__diagAudioProbe.oscillators++;
            return nativeOscillator(...oscArgs);
          };
          return ctx;
        }
      });
      window.AudioContext = Wrapped;
      if (window.webkitAudioContext) window.webkitAudioContext = Wrapped;
    }
  })();`,
});

const result = {};
try {
  result.qc = await diagnoseQC(cdp);
  console.log("QC_DIAGNOSTIC", JSON.stringify({
    visibleAtMs: result.qc.visibleAtMs,
    muteHeld: result.qc.muteHeld,
    beforeOsc: result.qc.beforeOsc,
    afterOsc: result.qc.afterOsc,
  }));
  result.peoples = await diagnosePeoples(cdp);
  console.log("PEOPLES_OVERFLOW_DIAGNOSTIC", JSON.stringify({
    maxOverflow: result.peoples.maxOverflow,
    finalOverflow: result.peoples.finalOverflow,
    samples: result.peoples.samples.length,
    first: result.peoples.samples[0] || null,
  }));
} finally {
  cdp.close();
  await fs.mkdir("live-diagnostic-evidence", { recursive: true });
  await fs.writeFile(
    "live-diagnostic-evidence/qc-peoples-diagnostic.json",
    JSON.stringify(result, null, 2)
  );
}

if (!result.qc?.muteHeld || result.qc?.visibleAtMs === null) process.exitCode = 1;
