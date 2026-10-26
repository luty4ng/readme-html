import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import "../extension/core.js";

const { resolveTarget, repository, fetchHtml, MAX_BYTES } = globalThis.ReadmeHtml;
const page = "https://github.com/luty/example";
const link = "https://github.com/luty/example/blob/main/docs/report.html#html-preview";

test("rendered Markdown link resolves to the same repository raw file", () => {
  assert.deepEqual(resolveTarget(link, page), {
    sourceUrl: "https://github.com/luty/example/blob/main/docs/report.html",
    rawUrl: "https://raw.githubusercontent.com/luty/example/main/docs/report.html",
    filename: "report.html"
  });
  assert.equal(resolveTarget("./docs/report.html#html-preview", `${page}/blob/main/README.md`).filename, "report.html");
  assert.equal(resolveTarget(link.replace("main/", "feature/docs/"), page).rawUrl,
    "https://raw.githubusercontent.com/luty/example/feature/docs/docs/report.html");
  assert.equal(resolveTarget(link.replace("main", "a".repeat(40)), page).rawUrl.includes("a".repeat(40)), true);
  assert.equal(resolveTarget(link.replace("report.html", "%E6%8A%A5%E5%91%8A.htm"), page).filename, "报告.htm");
});

test("previews run on repository/tree/README views, not issues or other websites", () => {
  assert.deepEqual(repository(page), ["luty", "example"]);
  assert.deepEqual(repository(`${page}/tree/main/docs`), ["luty", "example"]);
  assert.deepEqual(repository(`${page}/blob/main/docs/README.md`), ["luty", "example"]);
  for (const url of [`${page}/issues/1`, `${page}/pull/1`, `${page}/settings`, "https://example.com/luty/example"]) {
    assert.equal(repository(url), null);
  }
});

test("rejects external repositories, arbitrary hosts, credentials and invalid targets", () => {
  const badLinks = [
    link.replace("luty/example", "someone/else"),
    link.replace("github.com", "github.com.evil.test"),
    link.replace("github.com", "raw.githubusercontent.com"),
    link.replace("https:", "http:"),
    link.replace("github.com", "user:secret@github.com"),
    link.replace("report.html", "report.js"),
    link.replace("#html-preview", "?token=example#html-preview"),
    link.replace("#html-preview", "#other"),
    link.replace("report.html", "%2e%2e/%2e%2e/%2e%2e/%2e%2e/other/repo/blob/main/report.html"),
    link.replace("report.html", "..%2freport.html"),
    link.replace("report.html", "%5Creport.html"),
    link.replace("report.html", "%00report.html")
  ];
  for (const href of badLinks) assert.throws(() => resolveTarget(href, page), undefined, href);
});

test("fetch omits credentials and redirects, decodes streaming UTF-8 correctly", async () => {
  const html = "<!doctype html><h1>你好，README</h1>";
  const bytes = new TextEncoder().encode(html);
  const stream = new ReadableStream({ start(controller) {
    for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
    controller.close();
  } });
  const target = resolveTarget(link, page);
  const result = await fetchHtml(target, async (url, options) => {
    assert.equal(url, target.rawUrl);
    assert.equal(options.credentials, "omit");
    assert.equal(options.redirect, "error");
    assert.equal(options.referrerPolicy, "no-referrer");
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(stream);
  });
  assert.equal(result, html);
});

test("reports missing/private files, empty content and server errors", async () => {
  for (const [response, pattern] of [
    [new Response("", { status: 404 }), /public repositories only/],
    [new Response("", { status: 429 }), /HTTP 429/],
    [new Response(" \n "), /empty/],
    [new Response(null), /empty/]
  ]) {
    await assert.rejects(fetchHtml(resolveTarget(link, page), async () => response), pattern);
  }
});

test("enforces byte limit before and during streaming, including dishonest headers", async () => {
  await assert.rejects(fetchHtml(resolveTarget(link, page), async () =>
    new Response("small", { headers: { "content-length": String(MAX_BYTES + 1) } })), /1 MiB/);
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(MAX_BYTES + 1)); },
    cancel() { cancelled = true; }
  });
  await assert.rejects(fetchHtml(resolveTarget(link, page), async () =>
    new Response(stream, { headers: { "content-length": "1" } })), /1 MiB/);
  assert.equal(cancelled, true);
});

test("service worker validates actual sender before performing privileged network requests", async () => {
  let handler;
  let requests = 0;
  const context = vm.createContext({
    ReadmeHtml: { resolveTarget, fetchHtml: async () => { requests++; return "<h1>OK</h1>"; } },
    importScripts() {},
    chrome: { runtime: { id: "extension-id", onMessage: { addListener(fn) { handler = fn; } } } }
  });
  vm.runInContext(await readFile(new URL("../extension/background.js", import.meta.url), "utf8"), context);
  const sender = { id: "extension-id", frameId: 0, tab: { id: 1 }, url: page };
  const send = (href, from) => new Promise((resolve) => handler({ type: "readme-html:fetch", href }, from, resolve));
  for (const from of [{}, { ...sender, frameId: 1 }, { ...sender, id: "other" }, { ...sender, url: "https://evil.test" }]) {
    assert.equal((await send(link, from)).ok, false);
  }
  assert.equal((await send(link.replace("luty/example", "other/repo"), sender)).ok, false);
  assert.equal(requests, 0);
  assert.equal((await send(link, sender)).ok, true);
  assert.equal(requests, 1);
});

test("all extension entry points exist and permissions stay limited to GitHub", async () => {
  const root = new URL("../extension/", import.meta.url);
  const manifest = JSON.parse(await readFile(new URL("manifest.json", root), "utf8"));
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.host_permissions, ["https://raw.githubusercontent.com/*"]);
  assert.equal(manifest.permissions, undefined);
  for (const file of [manifest.background.service_worker, ...manifest.content_scripts[0].js,
    ...manifest.web_accessible_resources[0].resources, "viewer.js"]) {
    assert.ok((await readFile(new URL(file, root), "utf8")).length > 0);
  }
  for (const [size, file] of Object.entries(manifest.icons)) {
    const png = await readFile(new URL(file, root));
    assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(png.readUInt32BE(16), Number(size));
    assert.equal(png.readUInt32BE(20), Number(size));
  }
});
