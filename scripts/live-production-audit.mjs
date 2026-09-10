import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, request } from 'playwright';

const evidenceDir = path.resolve('live-audit-evidence');
await fs.mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const api = await request.newContext({ ignoreHTTPSErrors: true });
const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
};

async function scrollAll(page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(innerHeight * 0.72));
    for (let i = 0; i < 70; i += 1) {
      const h = document.documentElement.scrollHeight;
      if (scrollY + innerHeight >= h - 4) break;
      scrollBy(0, step);
      await new Promise(r => setTimeout(r, 100));
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(r => setTimeout(r, 700));
  });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
}

async function inspect(page) {
  return page.evaluate(() => {
    const images = Array.from(document.images).map(img => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: Math.round(img.getBoundingClientRect().width),
      renderedHeight: Math.round(img.getBoundingClientRect().height),
    }));
    return {
      title: document.title,
      bodyText: (document.body?.innerText || '').slice(0, 5000),
      imageCount: images.length,
      brokenImages: images.filter(i => i.complete && i.naturalWidth === 0),
      horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      buttons: Array.from(document.querySelectorAll('button')).map(b => ({ text: (b.innerText || '').trim(), aria: b.getAttribute('aria-label') })).slice(0, 60),
    };
  });
}

async function newObservedPage(viewport) {
  const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const evidence = { consoleErrors: [], pageErrors: [], failedCriticalRequests: [], badCriticalResponses: [] };
  page.on('console', msg => { if (msg.type() === 'error') evidence.consoleErrors.push(msg.text()); });
  page.on('pageerror', err => evidence.pageErrors.push(String(err)));
  page.on('requestfailed', req => {
    if (['document','script','stylesheet','image','font'].includes(req.resourceType())) {
      evidence.failedCriticalRequests.push({ url: req.url(), type: req.resourceType(), error: req.failure()?.errorText || 'unknown' });
    }
  });
  page.on('response', res => {
    if (res.status() >= 400 && ['document','script','stylesheet','image','font'].includes(res.request().resourceType())) {
      evidence.badCriticalResponses.push({ url: res.url(), status: res.status(), type: res.request().resourceType() });
    }
  });
  return { context, page, evidence };
}

const report = {
  generatedAt: new Date().toISOString(),
  chromium: await browser.version(),
  qcPagesRevision: null,
  interactions: {},
};

try {
  const rev = await api.get('https://heruahmose.github.io/QueenCalifia-CyberAI/deploy-commit.txt', { timeout: 20000, failOnStatusCode: false });
  report.qcPagesRevision = { status: rev.status(), text: (await rev.text()).trim() };
} catch (err) {
  report.qcPagesRevision = { status: null, error: String(err) };
}
console.log('QC_PAGES_REVISION ' + JSON.stringify(report.qcPagesRevision));

async function auditQC(viewportName, viewport) {
  const { context, page, evidence } = await newObservedPage(viewport);
  const result = { viewport: viewportName, url: 'https://heruahmose.github.io/QueenCalifia-CyberAI/', steps: [] };
  try {
    const nav = await page.goto(result.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    result.navStatus = nav?.status() ?? null;
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    const openSeal = page.getByRole('button', { name: /OPEN SOVEREIGN SEAL/i });
    await openSeal.waitFor({ state: 'visible', timeout: 10000 });
    result.steps.push({ sealed: true });
    await openSeal.click();
    const enter = page.getByRole('button', { name: /ENTER COMMAND FIELD/i });
    await enter.waitFor({ state: 'visible', timeout: 8000 });
    result.steps.push({ authorized: true });
    await enter.click();
    await page.waitForTimeout(1600);
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    result.dom = await inspect(page);
    result.dashboardVisible = /COMMAND|DASHBOARD|INTELLIGENCE|RESEARCH|THREAT/i.test(result.dom.bodyText);
    result.queenPortraitVisible = await page.locator('img[alt*="Queen Califia" i]:visible').count().catch(() => 0);
    await page.screenshot({ path: path.join(evidenceDir, `interaction-qc-${viewportName}.png`), fullPage: true });
  } catch (err) {
    result.error = String(err);
    result.dom = await inspect(page).catch(() => ({}));
  }
  Object.assign(result, evidence);
  result.hardFailure = Boolean(result.error) || (result.navStatus != null && result.navStatus >= 400) || (result.dom?.brokenImages?.length || 0) > 0 || evidence.pageErrors.length > 0 || evidence.failedCriticalRequests.length > 0 || evidence.badCriticalResponses.length > 0 || !result.dashboardVisible;
  await context.close();
  return result;
}

async function auditPeoples(viewportName, viewport) {
  const { context, page, evidence } = await newObservedPage(viewport);
  const result = { viewport: viewportName, url: 'https://heruahmose.github.io/peoples-portfolio/', steps: [] };
  try {
    const nav = await page.goto(result.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    result.navStatus = nav?.status() ?? null;
    const skip = page.getByRole('button', { name: /Skip the opening sequence/i });
    await skip.waitFor({ state: 'visible', timeout: 10000 });
    await skip.click();
    await page.waitForTimeout(900);
    result.steps.push({ introSkipped: true });
    await scrollAll(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const launcher = page.getByRole('button', { name: /Open H\.K\. Assistant/i });
    await launcher.waitFor({ state: 'visible', timeout: 8000 });
    result.hkLauncherVisible = true;
    result.hkLauncherText = await launcher.innerText();
    result.dom = await inspect(page);
    await page.screenshot({ path: path.join(evidenceDir, `interaction-peoples-home-${viewportName}.png`), fullPage: true });
    await launcher.click();
    await page.waitForTimeout(700);
    const bodyAfterHK = await page.locator('body').innerText();
    result.hkOpenTextPresent = /H\.K\.|PORTFOLIO GUIDE|assistant/i.test(bodyAfterHK);
    await page.screenshot({ path: path.join(evidenceDir, `interaction-peoples-hk-${viewportName}.png`), fullPage: false });
  } catch (err) {
    result.error = String(err);
    result.dom = await inspect(page).catch(() => ({}));
  }
  Object.assign(result, evidence);
  result.hardFailure = Boolean(result.error) || (result.navStatus != null && result.navStatus >= 400) || (result.dom?.brokenImages?.length || 0) > 0 || evidence.pageErrors.length > 0 || evidence.failedCriticalRequests.length > 0 || evidence.badCriticalResponses.length > 0 || !result.hkLauncherVisible || !result.hkOpenTextPresent;
  await context.close();
  return result;
}

async function auditTechBridge(viewportName, viewport) {
  const { context, page, evidence } = await newObservedPage(viewport);
  const result = { viewport: viewportName, url: 'https://techbridge-collective.org/', steps: [] };
  try {
    const nav = await page.goto(result.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    result.navStatus = nav?.status() ?? null;
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    const launcher = page.locator('[data-hk-launcher="true"]');
    await launcher.waitFor({ state: 'visible', timeout: 10000 });
    result.hkLauncherVisible = true;
    await launcher.click();
    const dialog = page.getByRole('dialog', { name: /H\.K\. Help Desk Architect/i });
    await dialog.waitFor({ state: 'visible', timeout: 8000 });
    result.hkDialogVisible = true;
    const avatar = dialog.locator('img[alt="H.K."]');
    await avatar.waitFor({ state: 'visible', timeout: 5000 });
    result.hkAvatar = await avatar.evaluate(img => ({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, src: img.currentSrc || img.src }));
    const wifi = page.getByRole('button', { name: /Fix Wi-Fi/i });
    await wifi.waitFor({ state: 'visible', timeout: 5000 });
    await wifi.click();
    await page.locator('[aria-label="H.K. triage result"]').waitFor({ state: 'visible', timeout: 4000 });
    result.triageResultVisible = true;
    result.dom = await inspect(page);
    await page.screenshot({ path: path.join(evidenceDir, `interaction-techbridge-hk-${viewportName}.png`), fullPage: false });
  } catch (err) {
    result.error = String(err);
    result.dom = await inspect(page).catch(() => ({}));
  }
  Object.assign(result, evidence);
  result.hardFailure = Boolean(result.error) || (result.navStatus != null && result.navStatus >= 400) || (result.dom?.brokenImages?.length || 0) > 0 || evidence.pageErrors.length > 0 || evidence.failedCriticalRequests.length > 0 || evidence.badCriticalResponses.length > 0 || !result.hkDialogVisible || !result.triageResultVisible || !(result.hkAvatar?.naturalWidth > 0);
  await context.close();
  return result;
}

let hardFailures = 0;
for (const [viewportName, viewport] of Object.entries(viewports)) {
  for (const [name, fn] of [['queen-califia-pages', auditQC], ['peoples-portfolio', auditPeoples], ['techbridge', auditTechBridge]]) {
    report.interactions[name] ??= {};
    const result = await fn(viewportName, viewport);
    report.interactions[name][viewportName] = result;
    if (result.hardFailure) hardFailures += 1;
    console.log('INTERACTION_RESULT ' + JSON.stringify({
      name, viewport: viewportName, hardFailure: result.hardFailure, error: result.error || null,
      navStatus: result.navStatus, dashboardVisible: result.dashboardVisible,
      queenPortraitVisible: result.queenPortraitVisible,
      hkLauncherVisible: result.hkLauncherVisible, hkDialogVisible: result.hkDialogVisible,
      hkAvatar: result.hkAvatar, triageResultVisible: result.triageResultVisible,
      brokenImages: result.dom?.brokenImages?.length ?? null,
      overflow: result.dom?.horizontalOverflowPx ?? null,
      failedCriticalRequests: result.failedCriticalRequests?.length ?? null,
      pageErrors: result.pageErrors?.length ?? null,
    }));
  }
}

report.summary = { interactiveSurfaces: 6, hardFailures };
await fs.writeFile(path.join(evidenceDir, 'interaction-report.json'), JSON.stringify(report, null, 2));
console.log('INTERACTION_AUDIT_SUMMARY ' + JSON.stringify(report.summary));

await api.dispose();
await browser.close();
if (hardFailures > 0) process.exitCode = 1;
