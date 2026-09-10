const CDP_HTTP = "http://127.0.0.1:9251";
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
        msg.error ? waiter.reject(new Error(JSON.stringify(msg.error))) : waiter.resolve(msg.result);
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
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "evaluation failed");
    return result.result.value;
  }
  close() { this.ws?.close(); }
}

async function waitForEval(cdp, expression, attempts = 100, delay = 100) {
  for (let i = 0; i < attempts; i++) {
    if (await cdp.eval(expression)) return true;
    await sleep(delay);
  }
  throw new Error(`timeout waiting for ${expression}`);
}

async function sweep(cdp) {
  return cdp.eval(`(async () => {
    let maxOverflow = 0;
    const samples = [];
    const maxHeight = Math.min(Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0), 24000);
    const step = Math.max(240, Math.floor(window.innerHeight * .55));
    for (let y = 0; y <= maxHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 70));
      const root = document.documentElement;
      const overflow = Math.max(0, root.scrollWidth - root.clientWidth);
      maxOverflow = Math.max(maxOverflow, overflow);
      samples.push({ y, overflow, clientWidth: root.clientWidth, scrollWidth: root.scrollWidth });
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 120));
    return { maxOverflow, samples };
  })()`);
}

const targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
const target = targets.find(item => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("no Chrome page target");
const cdp = new CDP(target.webSocketDebuggerUrl);
await cdp.open();

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await cdp.send("Page.navigate", { url: PEOPLES_URL });
  await waitForEval(cdp, `document.readyState === 'complete' && (document.body?.innerText || '').length > 20`, 120, 100);
  await sleep(1000);
  await waitForEval(cdp, `!!document.querySelector('button[aria-label="Skip the opening sequence"]')`, 80, 100);
  await cdp.eval(`document.querySelector('button[aria-label="Skip the opening sequence"]')?.click(); true`);
  await waitForEval(cdp, `!!document.querySelector('[data-peoples-sound]')`, 80, 100);
  const clicked = await cdp.eval(`(() => {
    const button = [...document.querySelectorAll('nav button')].find(button => (button.textContent || '').includes('3D GALLERY'));
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error("3D GALLERY control missing");
  await waitForEval(cdp, `location.pathname.endsWith('/gallery')`, 80, 100);
  await waitForEval(cdp, `!!document.querySelector('.trai-v54-grid')`, 80, 100);
  await sleep(700);

  let baseline = { maxOverflow: 0 };
  for (let pass = 0; pass < 3; pass++) {
    const current = await sweep(cdp);
    if (current.maxOverflow > baseline.maxOverflow) baseline = current;
    if (baseline.maxOverflow > 1) break;
    await sleep(180);
  }
  if (baseline.maxOverflow <= 1) {
    throw new Error(`baseline overflow did not reproduce: ${JSON.stringify(baseline)}`);
  }

  const visualBefore = await cdp.eval(`(() => {
    const grid = document.querySelector('.trai-v54-grid');
    const hologram = document.querySelector('.trai-v54-hologram');
    const gridStyle = getComputedStyle(grid);
    const rootStyle = getComputedStyle(hologram);
    return {
      gridWidth: gridStyle.width,
      gridHeight: gridStyle.height,
      animationName: gridStyle.animationName,
      backgroundImage: gridStyle.backgroundImage,
      hologramOpacity: rootStyle.opacity,
      hologramMixBlendMode: rootStyle.mixBlendMode
    };
  })()`);

  await cdp.eval(`(() => {
    const style = document.createElement('style');
    style.id = 'peoples-overflow-candidate';
    style.textContent = '.trai-v54-hologram{contain:paint!important;overflow:clip!important;}';
    document.head.appendChild(style);
    return true;
  })()`);
  await sleep(120);
  const contained = await sweep(cdp);
  const visualAfter = await cdp.eval(`(() => {
    const grid = document.querySelector('.trai-v54-grid');
    const hologram = document.querySelector('.trai-v54-hologram');
    const gridStyle = getComputedStyle(grid);
    const rootStyle = getComputedStyle(hologram);
    return {
      gridWidth: gridStyle.width,
      gridHeight: gridStyle.height,
      animationName: gridStyle.animationName,
      backgroundImage: gridStyle.backgroundImage,
      hologramOpacity: rootStyle.opacity,
      hologramMixBlendMode: rootStyle.mixBlendMode,
      contain: rootStyle.contain,
      overflowX: rootStyle.overflowX
    };
  })()`);

  console.log("PEOPLES_CONTAINMENT_PROBE", JSON.stringify({ baseline, contained, visualBefore, visualAfter }));
  if (contained.maxOverflow > 1) throw new Error(`candidate containment failed: ${contained.maxOverflow}px`);
  for (const key of ["gridWidth", "gridHeight", "animationName", "backgroundImage", "hologramOpacity", "hologramMixBlendMode"]) {
    if (visualAfter[key] !== visualBefore[key]) {
      throw new Error(`candidate changed visual contract ${key}: ${visualBefore[key]} -> ${visualAfter[key]}`);
    }
  }
  if (!visualAfter.contain.includes("paint") || visualAfter.overflowX !== "clip") {
    throw new Error(`candidate style not applied: ${JSON.stringify(visualAfter)}`);
  }
} finally {
  cdp.close();
}
