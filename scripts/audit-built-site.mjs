import { writeFileSync } from "node:fs";

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

const cdpEndpoint = (
  process.env.TRAI_CDP_URL || "http://127.0.0.1:9222"
).replace(/\/$/, "");
const baseUrl = new URL(
  process.env.TRAI_BASE_URL || "http://127.0.0.1:4173/trai-portfolio/"
);
const reportPath = process.env.TRAI_AUDIT_REPORT || "trai-browser-audit.json";

const canonicalRoutes = [
  {
    path: "case-studies",
    required: ["Validation Plans", "Evidence Before Claims"],
  },
  {
    path: "materials",
    required: [
      "TAMERIAN MATERIALS",
      "Bio-derived multifunctional composites for self-powered sensing",
    ],
  },
  {
    path: "community",
    required: ["TECHBRIDGE COLLECTIVE", "Designed · not operating"],
  },
  {
    path: "research",
    required: ["RESEARCH LAB", "2026 preprint, not peer reviewed"],
  },
  {
    path: "timeline",
    required: ["Documented Record & Next Gates", "status record"],
  },
  {
    path: "patent-claims",
    required: [
      "Provisional Application Claims Explorer",
      "25 application claims",
    ],
  },
  {
    path: "energy",
    required: ["Energy-Harvesting Research Directions", "not measured data"],
  },
  {
    path: "manufacturing",
    required: ["Proposed Manufacturing Sequence", "not a production record"],
    sectionIntro: true,
  },
  {
    path: "quantum",
    required: ["Quantum-Sensing Hypothesis", "not measured"],
  },
  {
    path: "applications",
    required: ["Proposed Application Directions", "not a deployment record"],
    sectionIntro: true,
  },
  {
    path: "true-melange",
    required: ["True Mélange Φ", "Blue-Gold Daily"],
  },
  {
    path: "queen-califia",
    required: ["Queen Califia", "human authorization"],
  },
  {
    path: "mela-nation",
    required: ["Mela", "No current operations are represented"],
  },
  {
    path: "melanina",
    required: ["MeLaNiNa", "remains in development"],
  },
  {
    path: "nu-ta-meri",
    required: [
      "Nu Ta Meri",
      "without treating unbuilt systems as deployed fact",
    ],
  },
  {
    path: "trai-coin",
    required: ["TRAI", "Not issued"],
  },
  {
    path: "founder",
    required: ["Jonathan Peoples", "U.S. Navy"],
  },
  {
    path: "peoples-foundation",
    required: ["The Peoples", "§508(c)(1)(A)"],
  },
  {
    path: "contact",
    required: ["something sovereign", "not a securities offering"],
  },
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const report = {
  baseUrl: baseUrl.href,
  startedAt: new Date().toISOString(),
  checks: [],
  failures: [],
  runtimeIssues: [],
};

let socket;
let sequence = 0;
let activeCheck = "startup";
const pending = new Map();
const requestUrls = new Map();

function recordFailure(check, message, detail) {
  const failure = { check, message };
  if (detail !== undefined) failure.detail = detail;
  report.failures.push(failure);
}

function sameOrigin(url) {
  try {
    return new URL(url).origin === baseUrl.origin;
  } catch {
    return false;
  }
}

function connectSocket(webSocketDebuggerUrl) {
  socket = new WebSocket(webSocketDebuggerUrl);
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error) {
        waiter.reject(new Error(JSON.stringify(message.error)));
      } else {
        waiter.resolve(message.result);
      }
      return;
    }

    const { method, params = {} } = message;
    if (method === "Network.requestWillBeSent") {
      requestUrls.set(params.requestId, params.request?.url || "");
      return;
    }
    if (method === "Network.responseReceived") {
      const status = Number(params.response?.status || 0);
      const url = params.response?.url || "";
      if (status >= 400 && sameOrigin(url)) {
        report.runtimeIssues.push({
          check: activeCheck,
          type: "http",
          status,
          url,
        });
      }
      return;
    }
    if (method === "Network.loadingFailed") {
      const url = requestUrls.get(params.requestId) || "";
      const reason = params.errorText || "unknown";
      if (
        sameOrigin(url) &&
        !params.canceled &&
        !/ERR_ABORTED|blocked by client/i.test(reason)
      ) {
        report.runtimeIssues.push({
          check: activeCheck,
          type: "network",
          reason,
          url,
        });
      }
      return;
    }
    if (method === "Runtime.exceptionThrown") {
      report.runtimeIssues.push({
        check: activeCheck,
        type: "exception",
        detail:
          params.exceptionDetails?.exception?.description ||
          params.exceptionDetails?.text ||
          "Runtime exception",
      });
      return;
    }
    if (method === "Runtime.consoleAPICalled" && params.type === "error") {
      report.runtimeIssues.push({
        check: activeCheck,
        type: "console.error",
        detail: (params.args || [])
          .map(argument => argument.value ?? argument.description ?? "")
          .join(" ")
          .slice(0, 1000),
      });
    }
  });
  return new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
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
    throw new Error(
      result.exceptionDetails.exception?.description ||
        result.exceptionDetails.text ||
        "Evaluation failed"
    );
  }
  return result?.result?.value;
}

async function waitFor(description, expression, timeout = 12000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await sleep(125);
  }
  throw new Error(`Timed out waiting for ${description}`);
}

async function navigate(path) {
  const url = new URL(path ? `${path}/` : "", baseUrl).href;
  const result = await send("Page.navigate", { url });
  if (result?.errorText)
    throw new Error(`Navigation failed: ${result.errorText}`);
  await waitFor(
    `React route ${path || "/"}`,
    `document.readyState === "complete" &&
      (document.getElementById("root")?.childElementCount || 0) > 0 &&
      (document.body?.innerText || "").length > 40`
  );
  await sleep(350);
  return url;
}

async function setViewport(viewport) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await send("Emulation.setTouchEmulationEnabled", {
    enabled: viewport.mobile,
    maxTouchPoints: viewport.mobile ? 5 : 0,
  });
}

async function visibleButton(label) {
  return evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find(candidate =>
      candidate.textContent?.trim() === ${JSON.stringify(label)} &&
      candidate.getClientRects().length > 0
    );
    return Boolean(button);
  })()`);
}

async function clickButton(label) {
  const clicked = await evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find(candidate =>
      candidate.textContent?.trim() === ${JSON.stringify(label)} &&
      candidate.getClientRects().length > 0
    );
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Visible button not found: ${label}`);
}

async function visibleDialog(label) {
  return evaluate(`Boolean(
    document.querySelector('[role="dialog"][aria-label=${JSON.stringify(label)}]')
      ?.getClientRects().length
  )`);
}

async function sweepPage() {
  return evaluate(`(async () => {
    let maxOverflow = 0;
    const limit = Math.min(
      Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0),
      24000
    );
    const step = Math.max(360, Math.floor(window.innerHeight * 0.78));
    for (let y = 0; y <= limit; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 35));
      maxOverflow = Math.max(
        maxOverflow,
        document.documentElement.scrollWidth - window.innerWidth,
        (document.body?.scrollWidth || 0) - window.innerWidth
      );
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 80));
    return maxOverflow;
  })()`);
}

async function snapshot() {
  const raw = await evaluate(`JSON.stringify({
    url: location.href,
    title: document.title,
    text: (document.body?.innerText || "").slice(0, 50000),
    rootChildren: document.getElementById("root")?.childElementCount || 0,
    h1: [...document.querySelectorAll("h1")].map(node => node.innerText.trim()).filter(Boolean),
    dialogs: [...document.querySelectorAll('[role="dialog"]')]
      .filter(node => node.getClientRects().length > 0)
      .map(node => node.getAttribute("aria-label") || "unlabelled"),
    overflow: Math.max(
      0,
      document.documentElement.scrollWidth - window.innerWidth,
      (document.body?.scrollWidth || 0) - window.innerWidth
    ),
    brokenImages: [...document.images]
      .filter(image => image.complete && image.naturalWidth === 0)
      .map(image => ({ src: image.currentSrc || image.src, alt: image.alt })),
    unbasedInternalLinks: [...document.querySelectorAll('a[href]')]
      .map(anchor => ({ raw: anchor.getAttribute("href"), resolved: anchor.href }))
      .filter(link => {
        if (!link.raw || !link.raw.startsWith("/")) return false;
        const resolved = new URL(link.resolved);
        return resolved.origin === location.origin &&
          !resolved.pathname.startsWith(${JSON.stringify(baseUrl.pathname)});
      }),
    errorOverlay: Boolean(document.querySelector("vite-error-overlay, #webpack-dev-server-client-overlay")),
    applicationError: /Application error|Something went wrong|Unexpected Application Error/i.test(document.body?.innerText || ""),
    activeElement: document.activeElement?.getAttribute("aria-label") ||
      document.activeElement?.textContent?.trim().slice(0, 120) ||
      document.activeElement?.tagName || "none"
  })`);
  return JSON.parse(raw);
}

function validateSnapshot(check, page, required, sweptOverflow = 0) {
  if (page.rootChildren <= 0) recordFailure(check, "React root is empty");
  if (page.text.length < 120)
    recordFailure(check, "Primary content is unexpectedly sparse", page.text);
  for (const phrase of required) {
    if (!page.text.toLowerCase().includes(phrase.toLowerCase())) {
      recordFailure(check, `Required primary content missing: ${phrase}`, {
        h1: page.h1,
      });
    }
  }
  const overflow = Math.max(page.overflow, sweptOverflow);
  if (overflow > 2)
    recordFailure(check, `Horizontal overflow: ${overflow}px`, page.h1);
  if (page.brokenImages.length)
    recordFailure(check, "Broken image content", page.brokenImages);
  if (page.unbasedInternalLinks.length)
    recordFailure(
      check,
      "Internal link escapes the configured Pages base",
      page.unbasedInternalLinks
    );
  if (page.errorOverlay || page.applicationError)
    recordFailure(check, "Application error surface is visible", {
      errorOverlay: page.errorOverlay,
      applicationError: page.applicationError,
    });
}

async function handleSectionIntro(route, check) {
  const dialogLabel = await evaluate(`(() => {
    const dialog = [...document.querySelectorAll('[role="dialog"]')].find(node =>
      node.getClientRects().length > 0 &&
      / introduction$/i.test(node.getAttribute("aria-label") || "")
    );
    return dialog?.getAttribute("aria-label") || null;
  })()`);

  if (!route.sectionIntro) {
    if (dialogLabel)
      recordFailure(
        check,
        "Unexpected intro blocked a direct route",
        dialogLabel
      );
    return;
  }
  if (!dialogLabel) {
    recordFailure(check, "Expected user-paced section intro is missing");
    return;
  }
  if (!(await visibleButton("Skip intro"))) {
    recordFailure(check, "Section intro has no visible Skip intro control");
    return;
  }
  const initialText = await evaluate(
    `document.querySelector('[role="dialog"]')?.innerText || ""`
  );
  if (!/User-paced/i.test(initialText))
    recordFailure(check, "Section intro does not identify user-paced behavior");

  await sleep(1500);
  if (!(await visibleDialog(dialogLabel))) {
    recordFailure(check, "Section intro dismissed without user input");
    return;
  }
  await clickButton("Skip intro");
  await waitFor(
    "section intro to close",
    `!document.querySelector('[role="dialog"][aria-label=${JSON.stringify(dialogLabel)}]')`
  );
}

async function auditRootDesktop() {
  const check = "desktop:/ intro progression";
  activeCheck = check;
  const issueStart = report.runtimeIssues.length;
  await setViewport(viewports[0]);
  await navigate("");

  const introLabel = "TRAI ceremonial introduction";
  if (!(await visibleDialog(introLabel)))
    recordFailure(check, "User-paced ceremonial intro did not appear");
  if (!(await visibleButton("Skip intro")))
    recordFailure(check, "Ceremonial intro has no visible Skip intro control");

  const firstStep = await evaluate(
    `document.querySelector('[role="dialog"]')?.innerText || ""`
  );
  await sleep(3000);
  const heldStep = await evaluate(
    `document.querySelector('[role="dialog"]')?.innerText || ""`
  );
  if (!heldStep || heldStep !== firstStep)
    recordFailure(
      check,
      "Ceremonial intro advanced or changed without user input"
    );

  for (const expected of ["Continue", "Continue", "Enter TRAI"]) {
    await clickButton(expected);
    await sleep(420);
  }
  await waitFor(
    "ceremonial intro to close",
    `!document.querySelector('[role="dialog"][aria-label="TRAI ceremonial introduction"]')`
  );

  const sweptOverflow = await sweepPage();
  const page = await snapshot();
  validateSnapshot(
    check,
    page,
    ["living architecture", "Mandate of Mistrust"],
    sweptOverflow
  );
  report.checks.push({
    check,
    status: report.failures.some(failure => failure.check === check)
      ? "failed"
      : "passed",
    h1: page.h1,
    runtimeIssues: report.runtimeIssues.length - issueStart,
  });
}

async function auditRootMobileAndHk() {
  const check = "mobile:/ skip and H.K.";
  activeCheck = check;
  const issueStart = report.runtimeIssues.length;
  await setViewport(viewports[1]);
  await navigate("");
  const introLabel = "TRAI ceremonial introduction";
  if (!(await visibleDialog(introLabel)))
    recordFailure(check, "Mobile ceremonial intro did not appear");
  if (!(await visibleButton("Skip intro")))
    recordFailure(check, "Mobile Skip intro control is missing");
  await sleep(1500);
  if (!(await visibleDialog(introLabel)))
    recordFailure(check, "Mobile intro dismissed without user input");
  await clickButton("Skip intro");
  await waitFor(
    "mobile ceremonial intro to close",
    `!document.querySelector('[role="dialog"][aria-label="TRAI ceremonial introduction"]')`
  );

  const opened = await evaluate(`(() => {
    const launcher = document.querySelector('button[aria-label="Open H.K. Assistant"]');
    if (!launcher || !launcher.getClientRects().length) return false;
    launcher.click();
    return true;
  })()`);
  if (!opened) {
    recordFailure(check, "Named H.K. launcher is missing or not visible");
  } else {
    await waitFor(
      "H.K. dialog",
      `Boolean(document.querySelector('[role="dialog"][aria-label="H.K. portfolio assistant"]')?.getClientRects().length)`
    );
    await sleep(120);
    const hk = JSON.parse(
      await evaluate(`JSON.stringify((() => {
        const dialog = document.querySelector('[role="dialog"][aria-label="H.K. portfolio assistant"]');
        const rect = dialog.getBoundingClientRect();
        return {
          text: dialog.innerText,
          rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
          focusInside: dialog.contains(document.activeElement)
        };
      })())`)
    );
    if (!/Verified public context · no external model/i.test(hk.text))
      recordFailure(check, "H.K. does not expose its bounded public runtime");
    if (!hk.focusInside)
      recordFailure(check, "Focus did not enter the H.K. modal");
    if (
      hk.rect.left < -1 ||
      hk.rect.right > viewports[1].width + 1 ||
      hk.rect.top < -1 ||
      hk.rect.bottom > viewports[1].height + 1
    ) {
      recordFailure(check, "H.K. modal exceeds the mobile viewport", hk.rect);
    }

    await clickButton("Tell me about TechBridge");
    const sent = await evaluate(`(() => {
      const button = document.querySelector('button[aria-label="Send message to H.K."]');
      if (!button || button.disabled) return false;
      button.click();
      return true;
    })()`);
    if (!sent) {
      recordFailure(check, "H.K. quick prompt could not be submitted");
    } else {
      await waitFor(
        "bounded H.K. response",
        `/bounded static guide/i.test(document.querySelector('[role="dialog"][aria-label="H.K. portfolio assistant"]')?.innerText || "")`
      );
    }

    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await waitFor(
      "H.K. dialog to close with Escape",
      `!document.querySelector('[role="dialog"][aria-label="H.K. portfolio assistant"]')`
    );
    await sleep(80);
    const focusReturned = await evaluate(
      `document.activeElement?.getAttribute("aria-label") === "Open H.K. Assistant"`
    );
    if (!focusReturned)
      recordFailure(check, "Focus did not return to the H.K. launcher");
  }

  const sweptOverflow = await sweepPage();
  const page = await snapshot();
  validateSnapshot(
    check,
    page,
    ["living architecture", "Mandate of Mistrust"],
    sweptOverflow
  );
  report.checks.push({
    check,
    status: report.failures.some(failure => failure.check === check)
      ? "failed"
      : "passed",
    h1: page.h1,
    runtimeIssues: report.runtimeIssues.length - issueStart,
  });
}

async function auditRoute(route, viewport) {
  const check = `${viewport.name}:/${route.path}`;
  activeCheck = check;
  const issueStart = report.runtimeIssues.length;
  await setViewport(viewport);
  await navigate(route.path);
  await handleSectionIntro(route, check);
  const rootIntroVisible = await visibleDialog("TRAI ceremonial introduction");
  if (rootIntroVisible)
    recordFailure(check, "Root ceremonial intro blocked a direct route");
  const sweptOverflow = await sweepPage();
  const page = await snapshot();
  validateSnapshot(check, page, route.required, sweptOverflow);
  const routeIssues = report.runtimeIssues.slice(issueStart);
  if (routeIssues.length)
    recordFailure(check, "Runtime or same-origin network errors", routeIssues);
  report.checks.push({
    check,
    status: report.failures.some(failure => failure.check === check)
      ? "failed"
      : "passed",
    h1: page.h1,
    overflow: Math.max(page.overflow, sweptOverflow),
    images: await evaluate("document.images.length"),
    runtimeIssues: routeIssues.length,
  });
}

async function main() {
  let target;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const targets = await fetch(`${cdpEndpoint}/json`).then(response => {
      if (!response.ok)
        throw new Error(`CDP target request failed: ${response.status}`);
      return response.json();
    });
    target = targets.find(
      candidate => candidate.type === "page" && candidate.webSocketDebuggerUrl
    );
    if (target) break;
    await sleep(250);
  }
  if (!target?.webSocketDebuggerUrl)
    throw new Error("Browser page target not found");

  await connectSocket(target.webSocketDebuggerUrl);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");

  await auditRootDesktop();
  await auditRootMobileAndHk();
  for (const viewport of viewports) {
    for (const route of canonicalRoutes) {
      await auditRoute(route, viewport);
    }
  }

  const apiLeaks = [...requestUrls.values()].filter(url =>
    /\/api\/trpc\//.test(url)
  );
  if (apiLeaks.length)
    recordFailure(
      "static runtime",
      "Static build attempted tRPC requests",
      apiLeaks
    );

  report.finishedAt = new Date().toISOString();
  report.summary = {
    checks: report.checks.length,
    passed: report.checks.filter(check => check.status === "passed").length,
    failed: report.failures.length,
    runtimeIssues: report.runtimeIssues.length,
  };
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
  recordFailure(
    activeCheck,
    "Audit harness failed",
    String(error?.stack || error)
  );
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 1;
  socket?.close();
}
