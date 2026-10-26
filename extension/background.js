/* global ReadmeHtml */
"use strict";
importScripts("core.js");

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.type !== "readme-html:fetch" && message?.type !== "readme-html:fetch-file") return;
  (async () => {
    try {
      if (sender.id !== chrome.runtime.id || sender.frameId !== 0 ||
          !sender.tab || !sender.url || !sender.url.startsWith("https://github.com/")) {
        throw new Error("Previews can only be requested from a supported GitHub page.");
      }
      const filePage = message.type === "readme-html:fetch-file";
      if (!filePage && typeof message.href !== "string") throw new Error("An HTML link is required.");
      // sender.url can retain the original document URL across GitHub's SPA navigation.
      const pageUrl = sender.tab.url || sender.url;
      // File-page requests are bound to the browser-reported sender URL, never a supplied target.
      const target = filePage ? ReadmeHtml.resolveFileTarget(pageUrl) : ReadmeHtml.resolveTarget(message.href, pageUrl);
      const html = await ReadmeHtml.fetchHtml(target);
      respond({ ok: true, html });
    } catch (error) {
      const timeout = error.name === "TimeoutError" || error.name === "AbortError";
      respond({ ok: false, error: timeout ? "The request timed out. Please retry." :
        error instanceof TypeError ? "Could not read the file. Check your connection and retry." : error.message });
    }
  })();
  return true;
});
