/* Run with a real unpacked MV3 extension in an isolated Chromium profile. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");

(async () => {
  const project = path.resolve(__dirname, "..");
  const extension = process.env.RHP_EXTENSION_PATH ? path.resolve(process.env.RHP_EXTENSION_PATH) : path.join(project, "extension");
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), "readme-html-test-"));
  const results = path.join(project, "test-results");
  await fs.mkdir(results, { recursive: true });
  const context = await chromium.launchPersistentContext(profile, {
    channel: "chromium",
    ...(process.env.RHP_CHROMIUM_EXECUTABLE ? { executablePath: process.env.RHP_CHROMIUM_EXECUTABLE } : {}),
    headless: true,
    viewport: { width: 1280, height: 950 },
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`]
  });
  const checks = [];
  const pass = (name) => { checks.push(name); console.log(`PASS ${name}`); };
  try {
    const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker", { timeout: 10000 });
    const extensionId = worker.url().split("/")[2];
    assert.ok(extensionId);
    pass("Manifest V3 extension and service worker load");

    const iconPage = await context.newPage();
    const icons = await worker.evaluate(() => chrome.runtime.getManifest().icons);
    for (const [size, file] of Object.entries(icons)) {
      await iconPage.goto(`chrome-extension://${extensionId}/${file}`);
      await iconPage.waitForFunction(() => document.images[0]?.complete && document.images[0]?.naturalWidth > 0);
      assert.equal(await iconPage.evaluate(() => document.images[0].naturalWidth), Number(size));
      assert.equal(await iconPage.evaluate(() => document.images[0].naturalHeight), Number(size));
    }
    await iconPage.close();
    pass("all four registered PNG icons decode at their intended dimensions in Chromium");

    const demo = await fs.readFile(path.join(project, "demo/report.html"), "utf8");
    const overview = await fs.readFile(path.join(project, "demo/project-overview.html"), "utf8");
    const rawRequests = [];
    const unexpected = [];
    const blocked = [];
    const outbound = [];
    let missingRecovered = false;
    context.on("request", (request) => {
      if (/attacker\.invalid/.test(request.url())) unexpected.push(request.url());
    });
    context.on("requestfailed", (request) => {
      if (/attacker\.invalid/.test(request.url())) blocked.push({ url: request.url(), error: request.failure() });
    });
    await context.route("https://attacker.invalid/**", async (route) => {
      outbound.push(route.request().url());
      await route.abort();
    });
    await context.route("https://raw.githubusercontent.com/**", async (route) => {
      const url = route.request().url();
      rawRequests.push(url);
      if (url.endsWith("/project-overview.html")) return route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: overview });
      if (url.endsWith("/missing.html") && !missingRecovered) return route.fulfill({ status: 404, body: "Not found" });
      if (url.endsWith("/empty.html")) return route.fulfill({ status: 200, body: "  " });
      if (url.endsWith("/unsafe.html")) return route.fulfill({ status: 200, body: `<!doctype html>
        <meta http-equiv="refresh" content="0;url=https://attacker.invalid/refresh">
        <base href="https://attacker.invalid/"><link rel="stylesheet" href="https://attacker.invalid/css">
        <style>@import 'https://attacker.invalid/import'; body{background-image:url(https://attacker.invalid/pixel)}</style>
        <script>fetch('https://attacker.invalid/script'); parent.postMessage('unsafe','*')</script>
        <h1 id="safe">Untrusted document</h1><img src="https://attacker.invalid/image" onerror="alert(1)">
        <iframe src="https://attacker.invalid/frame"></iframe><a href="https://attacker.invalid/link">External link</a>
        <form action="https://attacker.invalid/form"><input value="secret"><button>Send</button></form>
        <svg><a href="javascript:alert(1)"><text>x</text></a><use href="https://attacker.invalid/svg#x"/></svg>` });
      return route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: demo });
    });
    const base = "https://github.com/readme-html/example";
    const fixture = (links = `<p><a href="${base}/blob/main/demo/report.html#html-preview">View example report</a></p>`) => `<!doctype html>
      <html lang="en"><head><title>README HTML · browser check</title><meta name="viewport" content="width=device-width, initial-scale=1">
      <style>body{margin:0;background:#fff;color:#1f2328;font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
      header{padding:18px 32px;background:#f6f8fa;border-bottom:1px solid #d1d9e0;font-weight:600}
      main{max-width:920px;margin:32px auto;padding:24px;border:1px solid #d1d9e0;border-radius:8px}
      h1{font-size:28px}a{color:#0969da}@media(max-width:600px){main{margin:12px;padding:16px}}</style></head>
      <body><header>readme-html / example</header><main><article class="markdown-body"><h1>README HTML</h1>
      <p>A same-repository HTML document, embedded where you put its Markdown link.</p>${links}
      <p id="after">This paragraph stays below the preview.</p></article></main></body></html>`;
    await context.route("https://github.com/readme-html/**", async (route) => {
      // A deliberately restrictive GitHub-like CSP: the extension must not weaken it.
      await route.fulfill({ contentType: "text/html", body: fixture(), headers: {
        "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; frame-src 'self'; img-src 'self'; connect-src 'self'"
      } });
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForFunction(() => {
      const host = document.querySelector("[data-readme-html]");
      return host?.shadowRoot.querySelector(".viewport:not([hidden])");
    }, { timeout: 20000 });
    const host = page.locator("[data-readme-html]");
    assert.equal(await host.count(), 1);
    assert.equal(await page.locator(".markdown-body > p > a").count(), 1);
    const documentFrame = () => page.frames().find((frame) => frame.parentFrame()?.url().startsWith(`chrome-extension://${extensionId}/viewer.html`));
    const inner = documentFrame();
    assert.ok(inner, `HTML is inside a nested srcdoc iframe: ${JSON.stringify(page.frames().map((frame) => frame.url()))}`);
    await inner.waitForSelector("h1", { timeout: 10000 });
    assert.match(await inner.locator("h1").innerText(), /right inside your README/);
    assert.equal(await inner.locator(".card").count(), 3);
    assert.equal(await inner.locator(".bar").first().evaluate((node) => getComputedStyle(node).backgroundColor), "rgb(53, 122, 86)");
    pass("marker → worker fetch → inline HTML and CSS, original link preserved");
    await host.getByRole("button", { name: "Collapse", exact: true }).click();
    assert.equal(await host.locator("#preview-body").isVisible(), false);
    await host.getByRole("button", { name: "Expand", exact: true }).click();
    assert.equal(await host.locator(".viewport").isVisible(), true);
    pass("collapse / expand and accessible state");
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(results, "desktop.png"), fullPage: true });
    await page.setViewportSize({ width: 375, height: 812 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(results, "mobile.png"), fullPage: true });
    pass("375px layout without page horizontal overflow");
    await page.setViewportSize({ width: 1280, height: 950 });

    async function replaceLinks(links) {
      await page.evaluate((html) => {
        document.querySelector(".markdown-body").innerHTML = `<h1>README checks</h1>${html}`;
      }, links);
    }
    await replaceLinks(`<p><a href="${base}/blob/main/demo/project-overview.html#html-preview">Visual HTML README</a></p>`);
    await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".viewport:not([hidden])"));
    const visual = documentFrame();
    assert.ok(visual);
    await visual.waitForSelector("#faq", { timeout: 10000 });
    assert.match(await visual.locator("h1").innerText(), /直接读懂 HTML/);
    assert.equal(await visual.locator("svg").count(), 2);
    assert.equal(await visual.locator(".bar-row").count(), 4);
    assert.equal(await visual.locator("script,link,[src^=http]").count(), 0);
    await visual.getByRole("link", { name: "常见问题", exact: true }).click();
    await visual.locator("summary").first().click();
    assert.equal(await visual.locator("details").first().getAttribute("open"), "");
    await visual.getByRole("link", { name: "快速开始", exact: true }).click();
    await visual.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(results, "visual-readme-embedded.png"), fullPage: true });
    await page.setViewportSize({ width: 375, height: 812 });
    assert.equal(await visual.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(results, "visual-readme-mobile.png"), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 950 });
    pass("visual HTML README: UTF-8, SVG, CSS charts, fragment navigation, native FAQ and 375px layout");
    await replaceLinks(`<p><a href="${base}/blob/main/unsafe.html#html-preview">Unsafe fixture</a></p>`);
    await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".viewport:not([hidden])"));
    const unsafe = documentFrame();
    assert.ok(unsafe);
    assert.equal(await unsafe.locator("script,meta[http-equiv=refresh],iframe,base,link").count(), 0);
    assert.equal(await unsafe.locator("[onclick],[onerror],[src^=https],[href^=https],[action]").count(), 0);
    const viewer = page.frames().find((frame) => frame.url().startsWith(`chrome-extension://${extensionId}/viewer.html`));
    assert.equal(await viewer.locator("iframe").getAttribute("sandbox"), "");
    assert.equal(await unsafe.evaluate(() => location.origin), "null");
    assert.equal(await unsafe.evaluate(() => typeof globalThis.chrome?.runtime), "undefined");
    assert.equal(await unsafe.evaluate(() => { try { parent.document.body; return false; } catch { return true; } }), true);
    // Playwright also emits a request event for CSS loads stopped by CSP, before network routing.
    assert.deepEqual(outbound, []);
    assert.equal(blocked.length, unexpected.length);
    assert.ok(blocked.every((request) => /csp/i.test(request.error.errorText)));
    pass("scripts, network resources, refresh and navigation removed; opaque sandbox");

    await replaceLinks(`<p><a href="${base}/blob/main/missing.html#html-preview">Missing</a></p>`);
    await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".error"));
    assert.match(await host.locator(".status").innerText(), /File not found/);
    missingRecovered = true;
    await host.getByRole("button", { name: "Retry", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".viewport:not([hidden])"));
    pass("404 error and working retry");

    const before = rawRequests.length;
    await replaceLinks(`<p><a href="https://github.com/other/repo/blob/main/report.html#html-preview">Wrong repository</a></p>`);
    await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".error"));
    assert.match(await host.locator(".status").innerText(), /Cross-repository/);
    assert.equal(rawRequests.length, before);
    pass("cross-repository link rejected before network access");

    await replaceLinks(`<p><a href="${base}/blob/main/empty.html#html-preview">Empty file</a></p>`);
    await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".error"));
    assert.match(await host.locator(".status").innerText(), /empty/);
    pass("empty HTML has a clear error");
    await replaceLinks(`<p><a href="${base}/blob/main/report.html">Unmarked link</a></p>`);
    await page.waitForFunction(() => !document.querySelector("[data-readme-html]"));
    assert.equal(await host.count(), 0);
    pass("unmarked README stays unchanged");
    await replaceLinks(`<p><a href="${base}/blob/main/report.html#html-preview">First</a></p><p><a href="${base}/blob/main/second.html#html-preview">Second</a></p>`);
    await page.waitForFunction(() => {
      const hosts = [...document.querySelectorAll("[data-readme-html]")];
      return hosts.length === 2 && hosts.every((node) => node.shadowRoot.querySelector(".viewport:not([hidden])"));
    });
    assert.equal(await host.count(), 2);
    await page.evaluate((url) => document.querySelector(".markdown-body a").href = `${url}/blob/main/changed.html#html-preview`, base);
    await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".filename")?.textContent === "changed.html");
    await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".viewport:not([hidden])"));
    assert.equal(await host.count(), 2);
    pass("reused README link updates its preview when the branch or file changes");
    assert.deepEqual(pageErrors, []);
    pass("dynamic README replacement and multiple previews without duplicates");

    await page.evaluate(() => document.querySelector(".markdown-body a").removeAttribute("href"));
    await page.waitForFunction(() => document.querySelectorAll("[data-readme-html]").length === 1, null, { timeout: 3000 });
    assert.equal(await host.locator(".filename").innerText(), "second.html");
    await page.evaluate(() => document.querySelectorAll(".markdown-body a")[1].remove());
    await page.waitForFunction(() => !document.querySelector("[data-readme-html]"), null, { timeout: 3000 });
    pass("removing href or deleting a link clears its orphaned preview");

    for (let cycle = 0; cycle < 2; cycle++) {
      await replaceLinks(`<p><a href="${base}/blob/main/report.html#html-preview">Repeat use</a></p>`);
      await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".viewport:not([hidden])"));
      await page.evaluate((url) => { history.pushState({}, "", `${url}/issues/1`); dispatchEvent(new PopStateEvent("popstate")); }, base);
      await page.waitForFunction(() => !document.querySelector("[data-readme-html]"), null, { timeout: 3000 });
      await page.evaluate((url) => { history.pushState({}, "", url); dispatchEvent(new PopStateEvent("popstate")); }, base);
      await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".viewport:not([hidden])"));
      assert.equal(await host.count(), 1);
    }
    assert.deepEqual(pageErrors, []);
    pass("leaving and returning to README clears and restores previews across two cycles");

    if (process.argv.includes("--live")) {
      await context.unrouteAll();
      const liveRepository = "https://github.com/mdn/beginner-html-site-styled";
      await page.goto(liveRepository, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.locator(".markdown-body").first().waitFor({ timeout: 20000 });
      // Simulate an author adding the marker locally. No repository or remote page is edited.
      await page.evaluate((url) => {
        const paragraph = document.createElement("p");
        const link = document.createElement("a");
        link.href = `${url}/blob/main/index.html#html-preview`;
        link.textContent = "Local extension test: preview index.html";
        paragraph.append(link);
        document.querySelector(".markdown-body").prepend(paragraph);
      }, liveRepository);
      await page.waitForFunction(() => document.querySelector("[data-readme-html]")?.shadowRoot.querySelector(".viewport:not([hidden])"), { timeout: 25000 });
      const liveFrame = documentFrame();
      assert.ok(liveFrame);
      await liveFrame.waitForSelector("h1", { timeout: 10000 });
      assert.match(await liveFrame.locator("h1").innerText(), /Mozilla is cool/);
      await liveFrame.locator("p").last().waitFor({ state: "visible" });
      assert.match(await liveFrame.locator("body").innerText(), /Mozilla Manifesto/);
      await page.locator("[data-readme-html]").scrollIntoViewIfNeeded();
      // Let Chromium repaint an out-of-process iframe after scrolling it into view.
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(results, "live-github.png") });
      pass("live github.com README DOM + real Raw file + unmodified GitHub CSP (local marker only)");
    }
    if (process.argv.includes("--published")) {
      await context.unrouteAll();
      await page.goto("https://github.com/luty4ng/readme-html", { waitUntil: "domcontentloaded", timeout: 30000 });
      // No local marker injection: this link and HTML must both come from the published repository.
      await page.locator('.markdown-body a[href$="/demo/project-overview.html#html-preview"]').first().waitFor({ timeout: 20000 });
      await page.waitForFunction(() => [...document.querySelectorAll("[data-readme-html]")].some(node =>
        node.shadowRoot.querySelector(".filename")?.textContent === "project-overview.html" &&
        node.shadowRoot.querySelector(".viewport:not([hidden])")), null, { timeout: 25000 });
      // The README's introduction and screenshot can place the preview below the fold.
      // Scroll into view before testing inner-frame visibility on the real GitHub page.
      await page.locator("[data-readme-html]").first().scrollIntoViewIfNeeded();
      const publishedOuter = await page.locator("[data-readme-html]").first().locator("iframe").elementHandle();
      const publishedViewer = await publishedOuter.contentFrame();
      const publishedFrame = publishedViewer.childFrames()[0];
      assert.ok(publishedFrame);
      await publishedFrame.waitForSelector("#faq", { timeout: 10000 });
      assert.match(await publishedFrame.locator("h1").innerText(), /直接读懂 HTML/);
      await publishedFrame.getByRole("link", { name: "常见问题", exact: true }).click();
      await publishedFrame.locator("summary").first().click();
      assert.equal(await publishedFrame.locator("details").first().getAttribute("open"), "");
      await publishedFrame.evaluate(() => scrollTo(0, 0));
      await page.locator("[data-readme-html]").first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(results, "published-github.png") });
      await page.locator("[data-readme-html]").first().screenshot({ path: path.join(results, "published-preview.png") });
      pass("published luty4ng/readme-html: genuine README marker and Raw HTML, working FAQ, no DOM injection or mocked responses");
    }
    await fs.writeFile(path.join(results, "browser-results.json"), JSON.stringify({ checks, rawRequests, blocked, outbound, pageErrors }, null, 2));
    console.log(`\n${checks.length} browser checks passed. Screenshots: ${results}`);
  } finally {
    await context.close();
    if (path.dirname(path.resolve(profile)) === path.resolve(os.tmpdir()) &&
        path.basename(profile).startsWith("readme-html-test-")) {
      await fs.rm(profile, { recursive: true, force: true });
    }
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
