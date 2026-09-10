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

async function waitForEval(cdp, expr, attempts = 100, delay = 100) {
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
  await waitForEval(cdp, `document.readyState === 'complete' && (document.body?.innerText || '').length > 20`, 120, 100);
  await sleep(900);
  const hasSkip = await cdp.eval(`!!document.querySelector('button[aria-label="Skip the opening sequence"]')`);
  if (hasSkip) await cdp.eval(`document.querySelector('button[aria-label="Skip the opening sequence"]')?.click(); true`);
  await waitForEval(cdp, `!!document.querySelector('[data-peoples-sound]')`, 80, 100);
  const clicked = await cdp.eval(`(() => {
    const b = [...document.querySelectorAll('nav button')].find(x => (x.textContent || '').includes('3D GALLERY'));
    if (!b) return false; b.click(); return true;
  })()`);
  if (!clicked) throw new Error("3D GALLERY control missing");
  await waitForEval(cdp, `location.pathname.endsWith('/gallery')`, 80, 100);
  await waitForEval(cdp, `!!document.querySelector('.trai-v54-grid')`, 80, 100);
  await sleep(700);

  const report = await cdp.eval(`(async () => {
    const root = document.documentElement;
    const body = document.body;
    const hologram = document.querySelector('.trai-v54-hologram');
    const grid = document.querySelector('.trai-v54-grid');
    const aurora = document.querySelector('.afro-aurora-veil');
    const snap = label => {
      const hr = hologram?.getBoundingClientRect();
      const gr = grid?.getBoundingClientRect();
      const ar = aurora?.getBoundingClientRect();
      return {
        label,
        innerWidth: innerWidth,
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        bodyScrollWidth: body.scrollWidth,
        scrollX,
        rootScrollLeft: root.scrollLeft,
        bodyScrollLeft: body.scrollLeft,
        htmlOverflowX: getComputedStyle(root).overflowX,
        bodyOverflowX: getComputedStyle(body).overflowX,
        hologram: hologram ? {
          rect: { left: hr.left, right: hr.right, width: hr.width },
          overflowX: getComputedStyle(hologram).overflowX,
          contain: getComputedStyle(hologram).contain,
          width: getComputedStyle(hologram).width,
          left: getComputedStyle(hologram).left,
          right: getComputedStyle(hologram).right,
        } : null,
        gridRect: gr ? { left: gr.left, right: gr.right, width: gr.width } : null,
        auroraRect: ar ? { left: ar.left, right: ar.right, width: ar.width } : null,
      };
    };

    const baseline = snap('baseline');
    window.scrollTo(200, 0);
    await new Promise(r => setTimeout(r, 100));
    const afterWindowScroll = snap('after-window-scrollTo-200');
    root.scrollLeft = 200;
    body.scrollLeft = 200;
    await new Promise(r => setTimeout(r, 100));
    const afterElementScroll = snap('after-element-scrollLeft-200');
    window.scrollTo(0, 0);
    root.scrollLeft = 0;
    body.scrollLeft = 0;
    await new Promise(r => setTimeout(r, 50));

    const style = document.createElement('style');
    style.id = 'layout-viewport-probe';
    style.textContent = '.trai-v54-hologram{left:0!important;right:auto!important;width:100%!important;top:0!important;bottom:0!important;contain:paint!important;overflow:clip!important;}';
    document.head.appendChild(style);
    await new Promise(r => setTimeout(r, 120));
    const candidate = snap('candidate-width-100pct');
    window.scrollTo(200, 0);
    await new Promise(r => setTimeout(r, 100));
    const candidateAfterScroll = snap('candidate-after-scrollTo-200');
    window.scrollTo(0, 0);
    style.remove();
    await new Promise(r => setTimeout(r, 80));

    return { baseline, afterWindowScroll, afterElementScroll, candidate, candidateAfterScroll };
  })()`);

  console.log("PEOPLES_SCROLLABILITY_DIAGNOSTIC", JSON.stringify(report));
  await fs.mkdir("live-diagnostic-evidence", { recursive: true });
  await fs.writeFile("live-diagnostic-evidence/peoples-scrollability.json", JSON.stringify(report, null, 2));

  const maxObservedScrollLeft = Math.max(
    Math.abs(report.afterWindowScroll.scrollX || 0),
    Math.abs(report.afterWindowScroll.rootScrollLeft || 0),
    Math.abs(report.afterWindowScroll.bodyScrollLeft || 0),
    Math.abs(report.afterElementScroll.scrollX || 0),
    Math.abs(report.afterElementScroll.rootScrollLeft || 0),
    Math.abs(report.afterElementScroll.bodyScrollLeft || 0)
  );
  console.log(`PEOPLES_ACTUAL_HORIZONTAL_SCROLL=${maxObservedScrollLeft}`);
} finally {
  cdp.close();
}
