import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, request } from 'playwright';

const evidenceDir = path.resolve('live-audit-evidence');
await fs.mkdir(evidenceDir, { recursive: true });

const targets = [
  { name: 'techbridge', url: 'https://techbridge-collective.org/', markers: ['TechBridge', 'H.K.'] },
  { name: 'tamerian-materials', url: 'https://tamerian-materials.com/', markers: ['Tamerian'] },
  { name: 'queen-califia-pages', url: 'https://heruahmose.github.io/QueenCalifia-CyberAI/', markers: ['Queen Califia'] },
  { name: 'queen-califia-firebase', url: 'https://queencalifia-cyberai.web.app/', markers: ['Queen Califia'] },
  { name: 'peoples-portfolio', url: 'https://heruahmose.github.io/peoples-portfolio/', markers: ['Jonathan', 'Peoples'] },
  { name: 'trai-portfolio', url: 'https://heruahmose.github.io/trai-portfolio/', markers: ['TRAI'] },
  { name: 'blue-gold-daily', url: 'https://heruahmose.github.io/blue-gold-daily/layers.html', markers: [] },
];

const viewports = {
  desktop: { width: 1440, height: 1200 },
  mobile: { width: 390, height: 844 },
};

async function exerciseLazyContent(page) {
  await page.evaluate(async () => {
    const step = Math.max(320, Math.floor(window.innerHeight * 0.75));
    let lastHeight = 0;
    for (let pass = 0; pass < 80; pass += 1) {
      const height = Math.max(document.body?.scrollHeight ?? 0, document.documentElement.scrollHeight);
      if (window.scrollY + window.innerHeight >= height - 2) {
        if (height === lastHeight) break;
        lastHeight = height;
      }
      window.scrollBy(0, step);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 800));
  });
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(500);
}

const browser = await chromium.launch({ headless: true });
const api = await request.newContext({ ignoreHTTPSErrors: true });
const report = {
  generatedAt: new Date().toISOString(),
  userAgent: await browser.version(),
  targets: [],
};

let hardFailures = 0;

for (const target of targets) {
  const targetResult = { name: target.name, url: target.url, viewports: {}, routeChecks: [] };

  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const badResponses = [];

    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => pageErrors.push(String(err)));
    page.on('requestfailed', (req) => failedRequests.push({ url: req.url(), resourceType: req.resourceType(), failure: req.failure()?.errorText ?? 'unknown' }));
    page.on('response', (res) => { if (res.status() >= 400) badResponses.push({ url: res.url(), status: res.status(), resourceType: res.request().resourceType() }); });

    let navStatus = null;
    let navError = null;
    try {
      const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      navStatus = response?.status() ?? null;
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await exerciseLazyContent(page);
    } catch (err) {
      navError = String(err);
    }

    let dom = {};
    try {
      dom = await page.evaluate(({ markers }) => {
        const bodyText = document.body?.innerText ?? '';
        const imgs = Array.from(document.images).map((img) => ({
          src: img.currentSrc || img.src,
          alt: img.alt,
          loading: img.loading,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          renderedWidth: Math.round(img.getBoundingClientRect().width),
          renderedHeight: Math.round(img.getBoundingClientRect().height),
        }));
        const brokenImages = imgs.filter((img) => img.complete && img.naturalWidth === 0);
        const incompleteImages = imgs.filter((img) => !img.complete);
        const internalLinks = Array.from(document.querySelectorAll('a[href]'))
          .map((a) => a.href)
          .filter((href) => {
            try {
              const u = new URL(href);
              return u.origin === location.origin && /^https?:$/.test(u.protocol);
            } catch { return false; }
          });
        const favicon = Array.from(document.querySelectorAll('link[rel~="icon"]')).map((x) => x.href);
        return {
          title: document.title,
          bodyTextLength: bodyText.trim().length,
          bodyTextSample: bodyText.trim().slice(0, 600),
          markerPresence: Object.fromEntries(markers.map((m) => [m, bodyText.includes(m)])),
          imageCount: imgs.length,
          brokenImages,
          incompleteImages,
          images: imgs.slice(0, 60),
          internalLinks: [...new Set(internalLinks)].slice(0, 12),
          favicon,
          horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
          scrollHeight: document.documentElement.scrollHeight,
          viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
        };
      }, { markers: target.markers });
    } catch (err) {
      dom = { evaluateError: String(err) };
    }

    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
    await page.waitForTimeout(250);
    const screenshotPath = path.join(evidenceDir, `${target.name}-${viewportName}.png`);
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } catch (err) {
      await fs.writeFile(`${screenshotPath}.error.txt`, String(err));
    }

    const failedCriticalRequests = failedRequests.filter((r) => ['document', 'script', 'stylesheet', 'image', 'font'].includes(r.resourceType));
    const badCriticalResponses = badResponses.filter((r) => ['document', 'script', 'stylesheet', 'image', 'font'].includes(r.resourceType));
    const hard = Boolean(navError)
      || (navStatus !== null && navStatus >= 400)
      || (dom.brokenImages?.length ?? 0) > 0
      || failedCriticalRequests.length > 0
      || badCriticalResponses.length > 0;
    if (hard) hardFailures += 1;

    targetResult.viewports[viewportName] = {
      navStatus,
      navError,
      finalUrl: page.url(),
      ...dom,
      consoleErrors: consoleErrors.slice(0, 30),
      pageErrors: pageErrors.slice(0, 30),
      failedRequests: failedRequests.slice(0, 30),
      failedCriticalRequests: failedCriticalRequests.slice(0, 30),
      badResponses: badResponses.slice(0, 30),
      badCriticalResponses: badCriticalResponses.slice(0, 30),
      hardFailure: hard,
    };

    if (viewportName === 'desktop' && Array.isArray(dom.internalLinks)) {
      for (const href of dom.internalLinks.slice(0, 8)) {
        try {
          const res = await api.get(href, { timeout: 20000, failOnStatusCode: false });
          targetResult.routeChecks.push({ url: href, status: res.status(), ok: res.ok() });
        } catch (err) {
          targetResult.routeChecks.push({ url: href, status: null, ok: false, error: String(err) });
        }
      }
    }

    await context.close();
  }
  report.targets.push(targetResult);
}

await api.dispose();
await browser.close();

report.summary = {
  targetCount: report.targets.length,
  surfaceCount: report.targets.length * Object.keys(viewports).length,
  hardFailures,
};
await fs.writeFile(path.join(evidenceDir, 'report.json'), JSON.stringify(report, null, 2));

console.log('LIVE_AUDIT_SUMMARY ' + JSON.stringify(report.summary));
for (const target of report.targets) {
  for (const [viewport, result] of Object.entries(target.viewports)) {
    console.log('LIVE_AUDIT_RESULT ' + JSON.stringify({
      name: target.name,
      viewport,
      status: result.navStatus,
      finalUrl: result.finalUrl,
      title: result.title,
      bodyTextLength: result.bodyTextLength,
      imageCount: result.imageCount,
      brokenImages: result.brokenImages?.length ?? null,
      incompleteImages: result.incompleteImages?.length ?? null,
      consoleErrors: result.consoleErrors?.length ?? null,
      pageErrors: result.pageErrors?.length ?? null,
      failedRequests: result.failedRequests?.length ?? null,
      failedCriticalRequests: result.failedCriticalRequests?.length ?? null,
      badResponses: result.badResponses?.length ?? null,
      horizontalOverflowPx: result.horizontalOverflowPx,
      markers: result.markerPresence,
      hardFailure: result.hardFailure,
      navError: result.navError,
    }));
  }
}

if (hardFailures > 0) process.exitCode = 1;
