"use strict";

(() => {
  const token = location.hash.slice(1);
  const reply = (type) => parent.postMessage({ type, token }, "https://github.com");
  let received = false;
  window.addEventListener("message", (event) => {
    if (received || event.source !== parent || event.origin !== "https://github.com" ||
        event.data?.type !== "readme-html:render" || event.data.token !== token ||
        typeof event.data.html !== "string" || event.data.html.length > 1024 * 1024) return;
    received = true;
    try {
      const doc = new DOMParser().parseFromString(event.data.html, "text/html");
      // Defense in depth: the opaque-origin iframe AND its CSP remain the security boundary.
      doc.querySelectorAll("script, iframe, frame, frameset, object, embed, base, meta, link, portal").forEach((node) => node.remove());
      for (const node of doc.querySelectorAll("*")) {
        for (const attribute of [...node.attributes]) {
          const name = attribute.name.toLowerCase();
          if (name.startsWith("on") || ["srcdoc", "srcset", "action", "formaction", "ping", "target", "download", "poster", "background", "xml:base"].includes(name)) {
            node.removeAttribute(attribute.name);
          } else if (["href", "xlink:href", "src", "data"].includes(name)) {
            const value = attribute.value.trim();
            const fragment = (name === "href" || name === "xlink:href") && value.startsWith("#");
            const raster = name === "src" && node.localName === "img" && /^data:image\/(png|jpeg|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(value);
            if (!fragment && !raster) node.removeAttribute(attribute.name);
            // srcdoc inherits the viewer's base URL. Explicitly target this document so
            // fragment navigation cannot replace the preview with the extension viewer.
            else if (fragment && node.localName === "a") node.setAttribute(attribute.name, `about:srcdoc${value}`);
          }
        }
      }
      const policy = doc.createElement("meta");
      policy.httpEquiv = "Content-Security-Policy";
      policy.content = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'";
      const viewport = doc.createElement("meta");
      viewport.name = "viewport";
      viewport.content = "width=device-width, initial-scale=1";
      doc.head.prepend(policy, viewport);
      const frame = document.createElement("iframe");
      frame.title = "HTML document (static, isolated)";
      frame.setAttribute("sandbox", "");
      frame.referrerPolicy = "no-referrer";
      frame.srcdoc = "<!doctype html>" + doc.documentElement.outerHTML;
      frame.addEventListener("load", () => reply("readme-html:rendered"), { once: true });
      document.body.replaceChildren(frame);
    } catch {
      reply("readme-html:error");
    }
  });
  reply("readme-html:ready");
})();
