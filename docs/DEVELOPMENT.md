# Development

The extension uses Manifest V3 and browser APIs directly. It has no runtime dependencies; Playwright is only used for testing. No build step is needed to load `extension/`.

## Run checks

Use Node 22+:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

Browser checks load the real unpacked extension in a temporary Chromium profile. Deterministic GitHub/Raw fixtures exercise the end-to-end path under a restrictive GitHub-like CSP, plus HTML/CSS/SVG, native FAQ and fragment navigation, 375px layout, collapse/expand, errors/retry, dynamic navigation, and content isolation. Results and screenshots are written to the ignored `test-results/` directory.

To use an existing compatible Chromium executable, set `RHP_CHROMIUM_EXECUTABLE` to its full path.

## Live checks

```sh
npm run test:browser -- --published
```

This opens the real `luty4ng/readme-html` repository and verifies its committed README marker and Raw HTML, without inserting a marker or mocking the live responses. It makes network requests but does not modify the remote repository.

```sh
npm run test:browser -- --live
```

The alternate MDN smoke check adds a marker only to the local browser DOM of a public MDN repository and fetches that repository's real HTML. It does not publish that temporary marker. The two checks have different purposes and should not be described interchangeably.

## Isolation and permissions

`content.js` identifies a marked link → `background.js` validates the actual sender and same-repository target → `core.js` fetches the public Raw file → `viewer.js` removes active content and creates a sandboxed document.

- Content scripts run only on `https://github.com/*`.
- The background host permission is limited to `https://raw.githubusercontent.com/*`.
- Requests omit credentials, reject redirects, enforce the 1 MiB limit during streaming, and time out after 15 seconds.
- The document iframe has an empty sandbox: no script, same-origin, popup, form-submission, or top-navigation allowances.
- Document CSP blocks scripts and external resources. The extension does not weaken GitHub's CSP.
- Sanitizing is defense in depth. The sandbox and CSP form the main boundary. Do not add `allow-scripts` or `allow-same-origin` to the document frame.
- Internal anchor links explicitly target `about:srcdoc` so the inherited viewer base URL cannot replace the preview.

Ref/path segments are preserved from GitHub's resolved file link rather than guessing where a slash-containing branch name ends. Unusual refs and paths need real-world compatibility reports.

After editing the extension, reload it in `chrome://extensions` and refresh GitHub. Check the real GitHub path before release because GitHub DOM structure and policies can change.

## Two-week product validation

Hypothesis: developers who already share AI-generated HTML reports will repeatedly use a one-link README embed when it avoids publishing a separate site. Current alternatives include downloading the HTML, GitHub Pages, or a separate preview service.

- Week 1: invite five developers who already share HTML documents to try the public demo and embed their own document.
- Week 2: ask whether they read or embedded a second document without developer assistance.
- Primary metric: at least three of the five testers repeat the task.
- Decision: continue if that target is met; otherwise interview testers and adjust or stop expanding scope.

Collect feedback voluntarily through Issues. No telemetry is implemented. Store distribution, private repositories, and additional asset support should follow observed demand.
