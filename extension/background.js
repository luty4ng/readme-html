/* global ReadmeHtml */
"use strict";
importScripts("core.js");

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.type !== "readme-html:fetch") return;
  (async () => {
    try {
      if (sender.id !== chrome.runtime.id || sender.frameId !== 0 ||
          !sender.tab || !sender.url || typeof message.href !== "string") {
        throw new Error("Previews can only be requested from a GitHub README.");
      }
      const target = ReadmeHtml.resolveTarget(message.href, sender.url);
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
