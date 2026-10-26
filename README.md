<img src="./extension/icons/icon-128.png" width="64" height="64" alt="README HTML icon">

# README HTML

**Your HTML documents, right inside GitHub.**

A free, open-source Chrome extension that displays HTML reports and visual documentation inside a GitHub README. Keep the HTML in your repository, add one marked link, and readers with the extension see the document in place.

[Download v0.1.1](https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip) · [Live demo](#live-demo) · [中文指南](#中文快速上手) · [MIT license](./LICENSE)

![README HTML displaying a visual project document inside a real GitHub README](./docs/images/preview.png)

*Real extension preview, captured on this repository. The screenshot is visible to everyone; the embedded document requires the extension.*

> [!NOTE]
> **Developer preview · Chrome 120+ · public GitHub repositories.** Installation currently uses Developer mode. README HTML is not yet listed in the Chrome Web Store.

## Why README HTML?

- **Share visual documents where people already read.** Reports, project overviews, diagrams, and comparison tables can live beside the code that explains them.
- **Embed with one Markdown link.** Use inline CSS, SVG, CSS charts, and native expandable sections without deploying a separate website.
- **Start without an account or build step.** No API key, backend, analytics, or runtime dependencies. Free to use, modify, and redistribute under MIT.

The README stays ordinary Markdown. With the extension, this link adds a static preview below it:

```markdown
[View the report](./docs/report.html#html-preview)
```

## Install

1. Download the [extension ZIP](https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip) and extract it to a folder you intend to keep.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked**, then select the extracted folder containing `manifest.json`.
4. Open [this repository](https://github.com/luty4ng/readme-html), refresh if it was already open, and scroll to the [live demo](#live-demo).

No build step is required. The preview appears automatically; there is no toolbar button to click.

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

[打开可视化项目说明 / Visual HTML README](./demo/project-overview.html#html-preview)

Try its table of contents, expand an FAQ, collapse the preview, or drag the preview's lower edge to resize it. The document includes inline SVG, CSS bar/donut charts, and a compatibility table. Its sample metrics are labeled **Mock data**.

Without the extension, the original GitHub file link remains available. See the screenshot above for the rendered result, or try the [smaller example](./demo/README.md).

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

## Compatibility

| Supported | Current boundaries |
| --- | --- |
| Repository home, tree views containing a README, and standalone `README.md` / `README.markdown` pages | Public repositories on `github.com` |
| Same-repository `.html` / `.htm` files with `#html-preview` | UTF-8, up to 1 MiB; 15-second fetch timeout |
| Inline CSS, inline SVG, base64 raster images, and data fonts | External styles, fonts, images, and relative asset files are blocked |
| Multiple previews, collapse/expand, resize, retry, and native `<details>` | Fixed initial height with internal scrolling; no automatic content height |
| README updates during GitHub navigation | Unusual branch/path combinations still need wider field testing |

JavaScript, private repositories, GitHub Enterprise, GitLab, Issues/PRs, and cross-repository previews are outside the current version's scope. Edge installation has not been manually verified.

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

## 中文快速上手

这是一个免费、MIT 开源的 Chrome 插件：让同仓库的 HTML 文档直接显示在 GitHub README 的标记链接下方。

下载顶部的插件 ZIP 并解压 → 打开 `chrome://extensions` → 开启开发者模式 → 点击“加载已解压的扩展程序”，选择含 `manifest.json` 的目录 → 刷新 GitHub。

源码安装时选择本项目的 `extension` 文件夹。在同一个公开仓库的 README 中，单独一段写入：

```markdown
[查看报告](./docs/report.html#html-preview)
```

将路径替换成仓库里实际的 HTML 文件，再提交 README 和 HTML。首版支持公开仓库中的单文件静态文档，需要内嵌 CSS，不支持 JavaScript 和外部资源。安装后查看上面的 [Live demo](#live-demo) 即可体验；未安装插件的人仍能看到截图和原始文件链接。

## Development

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
| [Development guide](./docs/DEVELOPMENT.md) | Architecture, permissions, fixture tests, and real GitHub checks |
| [Distribution guide](./docs/PUBLISHING.md) | ZIP packaging and Chrome Web Store preparation |
| [Privacy policy](./PRIVACY.md) | Data handling, GitHub requests, and user choices |
