<div align="center">

<img src="./extension/icons/icon-128.png" width="112" height="112" alt="README HTML">

# README HTML

<p><strong>Your HTML documents. Right inside GitHub.</strong></p>

**Turn one Markdown link into a visual document.**<br>
Keep reports, diagrams, and project overviews beside your code.<br>
Read them in your README with a free, open-source Chrome extension.

[![Version](https://img.shields.io/badge/version-0.1.1-0969da)](https://github.com/luty4ng/readme-html/releases/tag/v0.1.1)
![Chrome 120+](https://img.shields.io/badge/Chrome-120%2B-4285F4)
[![MIT license](https://img.shields.io/badge/license-MIT-34d399)](./LICENSE)

**[Download](https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip)** · **[Live demo](#live-demo)** · [FAQ](#frequently-asked-questions) · [Documentation](#documentation) · [Report an issue](https://github.com/luty4ng/readme-html/issues)

**English** · [简体中文](./docs/zh-CN/README.md)

<br>

<img src="./docs/images/preview.png" width="900" alt="README HTML displaying charts and a visual project document inside a real GitHub README">

<sub>Actual extension preview on this repository. Sample metrics in the document are mock data.</sub>

</div>

<br>

README HTML is a free, MIT-licensed Chrome extension that renders static HTML files from the same public GitHub repository inline in its README. Add a Markdown link ending in `#html-preview`; readers with the extension installed see the document below the link. No build step, account, or separate hosting is required.

> [!NOTE]
> **Developer preview · Chrome 120+ · public GitHub repositories.** Installation currently uses Developer mode. README HTML is not yet listed in the Chrome Web Store.

## Is this for you?

You have an HTML report, an architecture overview, or an AI-generated document—and want readers to see it where they already read your code.

- **Share visual documents where people already read.** Reports, project overviews, diagrams, and comparison tables can live beside the code that explains them.
- **Embed with one Markdown link.** Use inline CSS, SVG, CSS charts, and native expandable sections without deploying a separate website.
- **Start without an account or build step.** No API key, backend, analytics, or runtime dependencies. Free to use, modify, and redistribute under MIT.

The README stays ordinary Markdown. With the extension, this link adds a static preview below it:

```markdown
[View the report](./docs/report.html#html-preview)
```

## Quick start

**Let your AI assistant help you install it.** Copy this prompt into a local AI coding assistant with terminal access, such as Codex:

```text
Help me install README HTML in desktop Chrome and verify its demo:
1. Download these two release assets from https://github.com/luty4ng/readme-html/releases/tag/v0.1.1:
   https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip
   https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip.sha256
2. Verify the ZIP's SHA-256 against the checksum file. Stop if it does not match.
3. Extract to a permanent, versioned folder in my user directory without overwriting an existing installation. Confirm that manifest.json is at the folder root, with name README HTML and version 0.1.1. No build, npm install, account, or API key is needed.
4. Help me open chrome://extensions in Chrome 120+. If your tools can operate this page, enable Developer mode and load that folder. Otherwise give me its absolute path and the exact clicks: Developer mode → Load unpacked → select that folder. Guide me through this step and wait for my confirmation before claiming installation is complete.
5. Open https://github.com/luty4ng/readme-html/blob/main/demo/README.md and refresh it if needed. Verify that a rendered HTML preview appears below the #html-preview link. If you cannot inspect my browser, ask me to confirm this result; report any unverified steps clearly.
Keep the installed folder in place. Explain that this developer-mode installation needs manual updates. Do not change browser security policies or modify my repositories.
```

The assistant prepares the files and guides installation; browser controls depend on its tools. Chrome still requires loading the unpacked folder. Prefer manual installation? Follow these steps:

**1 · Install the extension.**

Download and extract the [extension ZIP](https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip). Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the folder containing `manifest.json`.

The ZIP and its [SHA-256 checksum](https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip.sha256) are attached to the [v0.1.1 developer-preview release](https://github.com/luty4ng/readme-html/releases/tag/v0.1.1). Choose the named ZIP under **Assets**, rather than GitHub's automatic source archives. Keep the extracted folder in place while using the extension.

**2 · Open the demo.**

Visit [this repository](https://github.com/luty4ng/readme-html), refresh if it was already open, and scroll to the [live demo](#live-demo). The document appears below its link automatically; there is no toolbar button to click.

**3 · Add your own document.**

Save a self-contained HTML file in your public repository, add a marked link to its README, and commit both files. Follow the [embedding guide](#embed-your-own-document) below. No build step or separate hosting is required.

<details>
<summary>Install from source or update an existing installation</summary>

Clone the repository, then load its `extension` folder in `chrome://extensions`:

```sh
git clone https://github.com/luty4ng/readme-html.git
```

An unpacked extension does not automatically update. Replace the extracted files or pull the latest source, click **Reload** on the extension card, and refresh GitHub. Keep the loaded folder in place while using the extension.

</details>

## Live demo

With README HTML enabled, **a visual project document appears below this link**:

[Open the visual project overview](./demo/project-overview.en.html#html-preview)

Try its table of contents, expand an FAQ, collapse the preview, or drag the preview's lower edge to resize it. This English-language sample includes inline SVG, CSS bar/donut charts, and a compatibility table. Its sample metrics are labeled **Mock data**.

Without the extension, the original GitHub file link remains available. See the screenshot above for the rendered result, or browse [all demo documents](./demo/README.md).

## Embed your own document

1. Save a self-contained UTF-8 HTML document as `docs/report.html` in your **public GitHub repository**.
2. Add this link to the root README, in its own paragraph:

   ```markdown
   [View the report](./docs/report.html#html-preview)
   ```

3. Commit both files, then open the README on GitHub with the extension enabled. The preview appears below the link.

Use a path relative to the README you are editing. The HTML must belong to the same repository; GitHub Pages is not required.

<details>
<summary>A minimal HTML document you can copy</summary>

Save this as `docs/report.html`:

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Project report</title>
<style>body{font:16px/1.6 system-ui;padding:24px;color:#1f2328}h1{color:#0969da}</style>
<h1>Project report</h1>
<p>This HTML document is stored alongside the code.</p>
<details><summary>Implementation notes</summary><p>Inline CSS and native HTML work without JavaScript.</p></details>
</html>
```

</details>

**Generating a report with AI?** Ask for a single UTF-8 HTML file, inline CSS, SVG or CSS charts, and no JavaScript or external resources.

For a complete example with a copyable HTML report and verification steps, follow [How to embed an HTML report in a GitHub README](./docs/EMBED_HTML_IN_GITHUB_README.md).

## Frequently asked questions

### Can GitHub README display an HTML file directly?

GitHub supports selected HTML inside Markdown, but its rendering pipeline removes scripts and inline styles. Linking to a repository's `.html` file does not embed that file as a styled document in the README. README HTML adds that preview for readers with the extension installed. See [GitHub's rendering pipeline](https://github.com/github/markup#github-markup).

### Does every reader need to install the Chrome extension?

Yes. Each reader needs README HTML installed and enabled to see the inline preview. Readers without it retain the normal GitHub file link and can inspect or download the HTML source. Use a screenshot or a separately hosted page when the result must be visible without an extension.

### Can it run JavaScript or load external images and styles?

No. README HTML displays static documents with inline CSS, SVG, permitted base64 raster images, and data fonts. JavaScript, external stylesheets, external images, and relative asset files are blocked. This makes it suitable for self-contained reports and mockups, rather than interactive web applications.

### Does it support private repositories or other Git hosting services?

No. Version 0.1.1 supports public repositories on `github.com` and same-repository HTML files only. It does not authenticate to private repositories or support GitHub Enterprise, GitLab, cross-repository previews, or previews in Issues and pull requests. Files must be UTF-8 and no larger than 1 MiB.

### Is README HTML free, and does it require an account?

README HTML is free and open source under the [MIT license](./LICENSE). It requires no account, subscription, API key, or backend. The extension has no analytics or persistent usage storage; GitHub receives the public file requests needed to load documents. See the [privacy policy](./PRIVACY.md).

### Should I use README HTML, GitHub Pages, or a screenshot?

Choose based on how readers need to access the result:

| Option | Where readers see it | What readers need | Best fit |
| --- | --- | --- | --- |
| README HTML | A static preview inside the README | Chrome 120+ with the extension enabled | Self-contained reports stored beside code |
| GitHub Pages | A separately hosted web page | A browser, without this extension | A public documentation site or web demo |
| Screenshot in Markdown | An image inside the README | A browser, without this extension | A fixed visual summary without selectable document text |

[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) hosts HTML, CSS, and JavaScript as a website. README HTML adds an inline static preview while keeping the source document in the repository.

These answers describe v0.1.1 and were checked against its implementation on October 26, 2026. Maintained by [luty4ng](https://github.com/luty4ng); corrections and compatibility reports are welcome through [Issues](https://github.com/luty4ng/readme-html/issues).

## Compatibility

| Supported | Current boundaries |
| --- | --- |
| Repository home, tree views containing a README, and standalone `README.md` / `README.markdown` pages | Public repositories on `github.com` |
| Same-repository `.html` / `.htm` files with `#html-preview` | UTF-8, up to 1 MiB; 15-second fetch timeout |
| Inline CSS, inline SVG, base64 raster images, and data fonts | External styles, fonts, images, and relative asset files are blocked |
| Multiple previews, collapse/expand, resize, retry, and native `<details>` | Fixed initial height with internal scrolling; no automatic content height |
| README updates during GitHub navigation | Unusual branch/path combinations still need wider field testing |

JavaScript, private repositories, GitHub Enterprise, GitLab, Issues/PRs, and cross-repository previews are outside the current version's scope. Edge installation has not been manually verified.

For translated documents with live previews, use a language folder such as `docs/zh-CN/README.md`; filenames such as `README.zh-CN.md` are not currently recognized as standalone README pages.

## Privacy and isolation

The extension reads marked links on GitHub and fetches public files directly from `raw.githubusercontent.com`, without cookies or authentication credentials. It processes HTML in browser memory and has no telemetry, account, storage, or third-party preview server.

Documents render in a sandboxed iframe with a restrictive CSP. Scripts, event handlers, refresh directives, nested frames, and external resource/navigation attributes are removed. An isolated document can still contain misleading text; this viewer does not authenticate its content.

GitHub receives the public file requests needed for previews. See the [privacy policy](./PRIVACY.md) and [isolation details](./docs/DEVELOPMENT.md#isolation-and-permissions).

## Troubleshooting

| What you see | What to check |
| --- | --- |
| An ordinary file link, with no preview | Enable the extension for GitHub, refresh the page, and confirm the link ends with `#html-preview` in its own paragraph. |
| “File not found” | Check that the HTML is committed, its relative path and branch are correct, and the repository is public. Then click **Retry**. |
| Missing images, fonts, or styling | Inline the CSS; use inline SVG or base64 raster images. External and relative asset files are blocked. JavaScript does not run. |

Still stuck? [Report an issue](https://github.com/luty4ng/readme-html/issues) with your Chrome version, a minimal public example, and the expected and actual behavior. Exclude tokens and private content.

## Documentation

Node 22+ is used for tests; Playwright is a development-only dependency.

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

Small fixes and reproducible compatibility reports are welcome.

| Resource | Contents |
| --- | --- |
| [HTML report tutorial](./docs/EMBED_HTML_IN_GITHUB_README.md) · [中文](./docs/zh-CN/EMBED_HTML_IN_GITHUB_README.md) | A working document, README marker, expected result, and troubleshooting |
| [Development guide](./docs/DEVELOPMENT.md) | Architecture, permissions, fixture tests, and real GitHub checks |
| [Distribution guide](./docs/PUBLISHING.md) · 中文 | ZIP packaging and Chrome Web Store preparation |
| [Privacy policy](./PRIVACY.md) | Data handling, GitHub requests, and user choices |
