import fs from "node:fs/promises";

const CDP_HTTP = "http://127.0.0.1:9251";
const URL = "https://heruahmose.github.io/peoples-portfolio/";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class CDP {
  constructor(url) { this.url = url; this.id = 0; this.pending = new Map(); }
  async open() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", event => {
      const msg = JSON.parse(event.data);
      if (!msg.id || !this.pending.has(msg.id)) return;
      const p = this.pending.get(msg.id); this.pending.delete(msg.id);
      msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result);
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
    const r = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text || "eval failed");
    return r.result.value;
  }
  close() { this.ws?.close(); }
}

async function waitForEval(cdp, expr, attempts = 120, delay = 100) {
  for (let i = 0; i < attempts; i++) {
    if (await cdp.eval(expr)) return;
    await sleep(delay);
  }
  throw new Error(`timeout: ${expr}`);
}

const targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
const target = targets.find(t => t.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No page target");
const cdp = new CDP(target.webSocketDebuggerUrl);
await cdp.open();

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false,
  });
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await cdp.send("Page.navigate", { url: URL });
  await waitForEval(cdp, `document.readyState === 'complete' && (document.body?.innerText || '').length > 20`);
  await sleep(900);
  const hasSkip = await cdp.eval(`!!document.querySelector('button[aria-label="Skip the opening sequence"]')`);
  if (hasSkip) await cdp.eval(`document.querySelector('button[aria-label="Skip the opening sequence"]')?.click(); true`);
  await waitForEval(cdp, `!!document.querySelector('[data-peoples-sound]')`);

  const pre = await cdp.eval(`(() => {
    const style = document.createElement('style');
    style.id = 'stable-gutter-probe';
    style.textContent = 'html{scrollbar-gutter:stable!important;}';
    document.head.appendChild(style);
    const root = document.documentElement;
    return {
      innerWidth,
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      scrollHeight: root.scrollHeight,
      gutter: getComputedStyle(root).scrollbarGutter
    };
  })()`);
  await sleep(150);

  const clickedAt = Date.now();
  const clicked = await cdp.eval(`(() => {
    const b = [...document.querySelectorAll('nav button')].find(x => (x.textContent || '').includes('3D GALLERY'));
    if (!b) return false; b.click(); return true;
  })()`);
  if (!clicked) throw new Error("3D GALLERY control missing");
  await waitForEval(cdp, `location.pathname.endsWith('/gallery')`, 80, 25);

  const timeline = [];
  for (let i = 0; i < 50; i++) {
    const elapsed = Date.now() - clickedAt;
    const sample = await cdp.eval(`(() => {
      const root = document.documentElement;
      const before = {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        scrollHeight: root.scrollHeight,
        gutter: getComputedStyle(root).scrollbarGutter,
        grid: !!document.querySelector('.trai-v54-grid')
      };
      window.scrollTo(200, window.scrollY);
      const forcedX = window.scrollX;
      window.scrollTo(0, window.scrollY);
      return { ...before, forcedX };
    })()`);
    timeline.push({ t: elapsed, ...sample });
    await sleep(50);
  }

  const failures = timeline.filter(x => x.forcedX > 1 || x.scrollWidth - x.clientWidth > 1);
  const report = { pre, failures, timeline };
  console.log("PEOPLES_STABLE_GUTTER_PROBE", JSON.stringify({ pre, failureCount: failures.length, firstFailure: failures[0] || null }));
  await fs.mkdir("live-diagnostic-evidence", { recursive: true });
  await fs.writeFile("live-diagnostic-evidence/peoples-stable-gutter.json", JSON.stringify(report, null, 2));
  if (failures.length) throw new Error(`stable gutter failed ${JSON.stringify(failures.slice(0, 5))}`);
} finally {
  cdp.close();
}
