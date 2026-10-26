/* global ReadmeHtml */
(() => {
  "use strict";
  const previews = new Map();
  let filePreview = null;
  const css = `
    :host { display: block; margin: 16px 0; min-width: 0; color: var(--fgColor-default, #1f2328);
      font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    * { box-sizing: border-box; }
    .panel { border: 1px solid var(--borderColor-default, #d1d9e0); border-radius: 8px; overflow: hidden;
      background: var(--bgColor-default, #fff); }
    .toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 12px;
      background: var(--bgColor-muted, #f6f8fa); border-bottom: 1px solid var(--borderColor-default, #d1d9e0); }
    strong { font-size: 13px; }
    .filename { flex: 1; min-width: 60px; overflow-wrap: anywhere; color: var(--fgColor-muted, #59636e); }
    a { color: var(--fgColor-accent, #0969da); text-decoration: none; }
    a:hover { text-decoration: underline; }
    a, button { min-height: 36px; display: inline-flex; align-items: center; }
    button { border: 1px solid var(--borderColor-default, #d1d9e0); border-radius: 6px;
      padding: 4px 10px; background: var(--button-default-bgColor-rest, #f6f8fa); color: inherit;
      font: inherit; cursor: pointer; }
    button:hover { background: var(--button-default-bgColor-hover, #eaeef2); }
    button:disabled { cursor: wait; opacity: .65; }
    :focus-visible { outline: 2px solid var(--fgColor-accent, #0969da); outline-offset: 2px; }
    .status { padding: 12px; margin: 0; overflow-wrap: anywhere; }
    .error { color: var(--fgColor-danger, #b42318); }
    .viewport { height: 480px; min-height: 160px; max-height: 85vh; resize: vertical; overflow: auto; }
    iframe { display: block; width: 100%; height: 100%; border: 0; background: #fff; }
    .note { margin: 0; padding: 7px 12px; border-top: 1px solid var(--borderColor-default, #d1d9e0);
      font-size: 12px; color: var(--fgColor-muted, #59636e); }
    [hidden] { display: none !important; }
    @media (max-width: 480px) { .toolbar { padding: 8px; } a, button { min-height: 44px; }
      .viewport { height: 400px; } }
  `;

  function preview(anchor, fileSource = null) {
    const href = anchor.href;
    const pageUrl = location.href;
    const host = document.createElement("div");
    host.dataset.readmeHtml = "";
    if (fileSource) host.dataset.readmeHtmlFile = "";
    const root = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = css;
    root.append(style);
    const panel = document.createElement("section");
    panel.className = "panel";
    panel.setAttribute("aria-label", "HTML document preview");
    panel.innerHTML = `<div class="toolbar"><strong>HTML Preview</strong><span class="filename"></span>
      <a target="_blank" rel="noopener noreferrer">Source</a>
      <button type="button" class="toggle" aria-expanded="true" aria-controls="preview-body">Collapse</button></div>
      <div id="preview-body"><p class="status" role="status">Loading HTML…</p>
      <button type="button" class="retry" hidden>Retry</button><div class="viewport" hidden></div>
      <p class="note">Static preview · scripts and external resources are blocked · drag the lower edge to resize</p></div>`;
    root.append(panel);
    // Keep the original link, and put the block preview after its paragraph.
    if (fileSource) fileSource.before(host);
    else (anchor.closest("p") || anchor).after(host);
    const body = root.querySelector("#preview-body");
    const status = root.querySelector(".status");
    const viewport = root.querySelector(".viewport");
    const retry = root.querySelector(".retry");
    const toggle = root.querySelector(".toggle");
    root.querySelector(".filename").textContent = anchor.textContent.trim() || "HTML document";
    root.querySelector("a").hidden = true;
    if (fileSource) root.querySelector("a").addEventListener("click", (event) => {
      event.preventDefault();
      fileSource.scrollIntoView({ block: "start" });
    });
    toggle.addEventListener("click", () => {
      body.hidden = !body.hidden;
      toggle.textContent = body.hidden ? "Expand" : "Collapse";
      toggle.setAttribute("aria-expanded", String(!body.hidden));
    });

    function fail(message) {
      status.hidden = false;
      status.classList.add("error");
      status.textContent = message;
      viewport.hidden = true;
      viewport.replaceChildren();
      panel.setAttribute("aria-busy", "false");
      retry.hidden = false;
    }

    async function load() {
      panel.setAttribute("aria-busy", "true");
      retry.hidden = true;
      viewport.hidden = true;
      viewport.replaceChildren();
      status.hidden = false;
      status.classList.remove("error");
      status.textContent = "Loading HTML…";
      try {
        const target = fileSource ? ReadmeHtml.resolveFileTarget(pageUrl) : ReadmeHtml.resolveTarget(href, pageUrl);
        root.querySelector("a").href = target.sourceUrl;
        root.querySelector("a").hidden = false;
        root.querySelector(".filename").textContent = target.filename;
        const response = await chrome.runtime.sendMessage(fileSource ?
          { type: "readme-html:fetch-file" } : { type: "readme-html:fetch", href });
        if (!response?.ok) throw new Error(response?.error || "The extension could not load this file.");
        if (!host.isConnected) return;
        const token = crypto.randomUUID();
        const frame = document.createElement("iframe");
        frame.title = `HTML preview: ${target.filename}`;
        frame.referrerPolicy = "no-referrer";
        frame.src = `${chrome.runtime.getURL("viewer.html")}#${token}`;
        await new Promise((resolve, reject) => {
          const cleanup = () => { clearTimeout(timeout); window.removeEventListener("message", onMessage); };
          const onMessage = (event) => {
            if (event.source !== frame.contentWindow || event.data?.token !== token) return;
            if (event.data.type === "readme-html:ready") {
              frame.contentWindow.postMessage({ type: "readme-html:render", token, html: response.html }, "*");
            } else if (event.data.type === "readme-html:rendered") {
              cleanup(); resolve();
            } else if (event.data.type === "readme-html:error") {
              cleanup(); reject(new Error("This HTML document could not be rendered."));
            }
          };
          const timeout = setTimeout(() => { cleanup(); reject(new Error("Preview did not start. Reload GitHub or retry.")); }, 10000);
          window.addEventListener("message", onMessage);
          viewport.append(frame);
        });
        status.hidden = true;
        viewport.hidden = false;
        panel.setAttribute("aria-busy", "false");
      } catch (error) {
        fail(error.message || "Could not load this preview. Reload the page and retry.");
      }
    }
    retry.addEventListener("click", load);
    load();
    return host;
  }

  function scan() {
    try {
      const supported = ReadmeHtml.repository(location.href);
      let fileTarget = null;
      try { fileTarget = ReadmeHtml.resolveFileTarget(location.href); } catch { /* Not an HTML file page. */ }
      const fileSource = fileTarget ?
        document.querySelector("#read-only-cursor-text-area")?.closest("section") || document.querySelector(".blob-wrapper") : null;
      if (filePreview && (!fileTarget || filePreview.href !== fileTarget.sourceUrl ||
          filePreview.source !== fileSource || !filePreview.host.isConnected)) {
        filePreview.host.remove();
        filePreview = null;
      }
      if (fileTarget && fileSource && !filePreview) {
        const anchor = { href: fileTarget.sourceUrl, textContent: fileTarget.filename };
        filePreview = { href: fileTarget.sourceUrl, source: fileSource, host: preview(anchor, fileSource) };
      }
      // A link can disappear while its paragraph (and our sibling panel) survives.
      // Sweep tracked links before selecting a[href], which excludes removed hrefs.
      for (const [anchor, previous] of previews) {
        if (!supported || !anchor.isConnected || !anchor.closest(".markdown-body") ||
            !anchor.hasAttribute("href") || previous.href !== anchor.href || !previous.host.isConnected) {
          previous.host.remove();
          previews.delete(anchor);
        }
      }
      if (!supported) return;
      for (const anchor of document.querySelectorAll(".markdown-body a[href]")) {
        if (previews.has(anchor)) continue;
        let hash;
        try { hash = new URL(anchor.href, location.href).hash; } catch { continue; }
        if (hash !== ReadmeHtml.MARKER) continue;
        previews.set(anchor, { href: anchor.href, host: preview(anchor) });
      }
    } catch {
      // Ignore a page that isn't a supported repository view.
    }
  }

  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    setTimeout(() => { pending = false; scan(); }, 100);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
  document.addEventListener("turbo:load", scan);
  window.addEventListener("popstate", scan);
  window.addEventListener("hashchange", scan);
  scan();
})();
