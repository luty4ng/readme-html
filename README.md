# README HTML

Read HTML reports and visual documentation **inside a GitHub README**. Add one link to a file in your repository; readers with the Chrome extension see the document in place, without publishing a separate website.

- **One Markdown link.** Keep HTML alongside your code and embed it where readers need it.
- **Your document's layout.** Inline CSS, SVG, CSS charts, tables, and native HTML disclosure panels.
- **Static, isolated previews.** Scripts and external resources are blocked; GitHub's CSP stays intact.
- **Free and open source.** MIT licensed, no account, API key, backend, or analytics. Zero runtime dependencies.

```markdown
[View the report](./docs/report.html#html-preview)
```

![README HTML displaying a visual project document inside a real GitHub README](./docs/images/preview.png)

*Captured from this repository with the actual extension. Readers without the extension can still see this screenshot and follow the original file link.*

[Install](#install) · [Live demo](#在线体验--live-demo) · [Compatibility](#compatibility) · [中文指南](#中文快速上手) · [Contribute](#development-and-contributing) · [Publishing](./docs/PUBLISHING.md)

## Install

**Chrome 120+ · developer preview · not yet listed in the Chrome Web Store**

1. Download the [extension ZIP](https://github.com/luty4ng/readme-html/releases/download/v0.1.0/readme-html-v0.1.0.zip) and extract it to a folder you intend to keep.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked**, then select the extracted folder containing `manifest.json`.
4. Refresh an already-open GitHub repository page.

Prefer source? Clone the repository and select its `extension` folder instead:

```sh
git clone https://github.com/luty4ng/readme-html.git
```

No build step is required. An unpacked extension does not automatically update: replace the extracted files or pull the latest source, reload the extension, and refresh GitHub. Edge installation has not been manually verified.

## 在线体验 / Live demo

With the extension enabled, **the following link becomes an embedded HTML document**. Scroll inside it, follow its table of contents, expand an FAQ, or drag the preview's lower edge to resize it.

[打开可视化项目说明 / Visual HTML README](./demo/project-overview.html#html-preview)

The example includes a project overview, installation guide, workflow, compatibility table, SVG, CSS bar/donut charts, and native expandable FAQs. All report metrics are explicitly labeled **Mock data**.

Without the extension, this remains an ordinary GitHub file link. See the screenshot above for the rendered result, or open the [shorter demo README](./demo/README.md) after installing.

## Embed your own document

1. Add a self-contained UTF-8 HTML file to a **public GitHub repository**.
2. Put a relative link in that repository's README, ending with `#html-preview`. Give the link its own paragraph.
3. Open the README on GitHub with README HTML enabled. The preview appears below the original link.

For a file at `docs/report.html`, use the example at the top of this page. No GitHub Pages deployment or Markdown parser changes are needed.

**Generating a report with AI?** Ask for a single UTF-8 HTML file, inline CSS, SVG or CSS charts, and no JavaScript or external resources.

## Compatibility

| Supported | Current limits |
| --- | --- |
| Repository home, tree views containing a README, and standalone `README.md` / `README.markdown` pages | Public repositories on `github.com` |
| Same-repository `.html` / `.htm` files with `#html-preview` | UTF-8, up to 1 MiB; 15-second fetch timeout |
| Inline CSS, inline SVG, base64 raster images, and data fonts | External styles, fonts, images, and relative asset files are blocked |
| Multiple previews, collapse/expand, resize, retry, and native `<details>` | Fixed initial height with internal scrolling; no automatic content height |
| README updates during GitHub navigation | Unusual branch/path combinations still need wider field testing |

JavaScript, private repositories, GitHub Enterprise, GitLab, Issues/PRs, and cross-repository previews are outside the current version's scope.

## Privacy and isolation

The extension reads marked links on GitHub and fetches public files directly from `raw.githubusercontent.com`, without cookies or authentication credentials. It processes HTML in browser memory and has no telemetry, account, storage, or third-party preview server.

Documents render in a sandboxed iframe with a restrictive CSP. Scripts, event handlers, refresh directives, nested frames, and external resource/navigation attributes are removed. An isolated document can still contain misleading text; this viewer does not authenticate its content.

Read the [privacy policy](./PRIVACY.md) and [implementation notes](./docs/DEVELOPMENT.md#isolation-and-permissions) for the data flow and security boundaries.

## 中文快速上手

下载上面的插件 ZIP 并解压 → 打开 `chrome://extensions` → 开启开发者模式 → 加载包含 `manifest.json` 的解压目录 → 刷新 GitHub。

源码安装时选择本项目的 `extension` 文件夹。在同一个公开仓库的 README 中，单独一段写入：

```markdown
[查看报告](./docs/report.html#html-preview)
```

将路径替换成仓库里实际的 HTML 文件。首版适合单文件静态文档，HTML 需要内嵌 CSS，不支持 JavaScript 和外部资源。上面的“在线体验”就是完整示例。

## Development and contributing

Node 22+ is used for tests; Playwright is a development-only dependency.

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

Small fixes and reproducible compatibility reports are welcome. [Open an issue](https://github.com/luty4ng/readme-html/issues) with Chrome version, a minimal public example, expected behavior, and the actual result. Exclude tokens and private content.

See [development and live test instructions](./docs/DEVELOPMENT.md), [ZIP packaging and store publishing](./docs/PUBLISHING.md).

## License

[MIT](./LICENSE). Free to use, modify, and redistribute.
