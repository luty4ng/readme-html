(() => {
  "use strict";

  const MARKER = "#html-preview";
  const MAX_BYTES = 1024 * 1024;

  function pathParts(url) {
    return url.pathname.split("/").filter(Boolean).map((part) => {
      const decoded = decodeURIComponent(part);
      if (decoded === "." || decoded === ".." || /[\\/\x00-\x1f\x7f]/.test(decoded)) {
        throw new Error("This file path is not supported.");
      }
      return decoded;
    });
  }

  function repository(pageUrl) {
    const url = new URL(pageUrl);
    if (url.origin !== "https://github.com") return null;
    const parts = pathParts(url);
    if (parts.length < 2) return null;
    if (parts[2] && parts[2] !== "tree" &&
        !(parts[2] === "blob" && /^readme\.(md|markdown)$/i.test(parts.at(-1)))) {
      return null;
    }
    return parts.slice(0, 2);
  }

  function resolveTarget(href, pageUrl) {
    const current = repository(pageUrl);
    const url = new URL(href, pageUrl);
    if (url.hash !== MARKER) throw new Error("The link needs a #html-preview marker.");
    if (!current || url.origin !== "https://github.com" || url.username || url.password) {
      throw new Error("Use an HTML file from this GitHub repository.");
    }
    const parts = pathParts(url);
    if (parts.slice(0, 2).join("/").toLowerCase() !== current.join("/").toLowerCase()) {
      throw new Error("Cross-repository previews are not supported. Use a file from this repository.");
    }
    if (parts[2] !== "blob" || parts.length < 5 || !/\.html?$/i.test(parts.at(-1)) || url.search) {
      throw new Error("Link to a repository .html or .htm file, without query parameters.");
    }
    return fileTarget(url, parts);
  }

  function fileTarget(url, parts) {
    url.hash = "";
    const rawUrl = new URL("https://raw.githubusercontent.com");
    // Keep the rendered GitHub ref/path intact; do not guess where a ref containing '/' ends.
    rawUrl.pathname = url.pathname.replace(/^\/([^/]+)\/([^/]+)\/blob\//, "/$1/$2/");
    return { sourceUrl: url.href, rawUrl: rawUrl.href, filename: parts.at(-1) };
  }

  function resolveFileTarget(pageUrl) {
    const url = new URL(pageUrl);
    const parts = pathParts(url);
    if (url.origin !== "https://github.com" || url.username || url.password || url.search ||
        parts[2] !== "blob" || parts.length < 5 || !/\.html?$/i.test(parts.at(-1))) {
      throw new Error("Open a public GitHub .html or .htm file to preview it.");
    }
    return fileTarget(url, parts);
  }

  async function fetchHtml(target, fetcher = fetch) {
    const response = await fetcher(target.rawUrl, {
      credentials: "omit",
      redirect: "error",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("File not found. Check the path and branch. This version supports public repositories only.");
      }
      throw new Error(`GitHub returned HTTP ${response.status}. Try again later.`);
    }
    if (Number(response.headers.get("content-length")) > MAX_BYTES) {
      await response.body?.cancel();
      throw new Error("This HTML file exceeds the 1 MiB preview limit.");
    }
    if (!response.body) throw new Error("This HTML file is empty.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8", { fatal: true });
    let bytes = 0;
    let html = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_BYTES) {
          await reader.cancel();
          throw new Error("This HTML file exceeds the 1 MiB preview limit.");
        }
        html += decoder.decode(value, { stream: true });
      }
      html += decoder.decode();
    } finally {
      reader.releaseLock();
    }
    if (!html.trim()) throw new Error("This HTML file is empty.");
    return html;
  }

  globalThis.ReadmeHtml = Object.freeze({ MARKER, MAX_BYTES, repository, resolveTarget, resolveFileTarget, fetchHtml });
})();
