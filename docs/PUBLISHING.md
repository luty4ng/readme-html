# 安装包与 Chrome 商店上架

当前版本为免费、MIT 开源的开发预览版，尚未在 Chrome Web Store 上架。

官方要求核对日期：2026-10-26。v0.1.2 新增 HTML 文件页自动预览；原有 README 标记预览保留，权限不变。

## 现在可以用哪些材料？

| 材料 | 当前状态 / 入口 |
| --- | --- |
| 插件 ZIP | [下载 v0.1.2](https://github.com/luty4ng/readme-html/releases/download/v0.1.2/readme-html-v0.1.2.zip)，可作为首次上传候选包 |
| 128×128 PNG 图标 | [icon-128.png](../extension/icons/icon-128.png)，已包含在 ZIP 内 |
| 英文简介、详细说明和审核步骤 | 下方已提供可复制文案 |
| 隐私政策 | `https://github.com/luty4ng/readme-html/blob/main/PRIVACY.md` |
| 支持入口 | `https://github.com/luty4ng/readme-html/issues` |
| 真实使用截图 | 尚需准备至少 1 张 1280×800 或 640×400 图片；README 截图不是符合该尺寸的商店素材 |
| 开发者账号 | 维护者注册、付款、启用两步验证，并完成控制台要求的账号验证 |

优先准备 1280×800 的真实 GitHub 演示截图，让插件预览占据主要区域。440×280 小型宣传图和 1400×560 大型宣传图为可选材料；可在首次上架后完善。规格以 [Chrome 官方素材要求](https://developer.chrome.com/docs/webstore/images) 为准。

## 选择分发方式

| 方式 | 安装过程 | 适合场景 |
| --- | --- | --- |
| GitHub Release ZIP | 下载、解压、开启开发者模式、“加载已解压的扩展程序” | 早期试用、开源开发者 |
| Chrome Web Store | 打开商店页面，点击“添加至 Chrome” | 面向普通用户正式分发 |
| 自行打包 CRX | Windows/macOS 普通用户不能依赖本地 CRX 完成外部安装 | 不作为本项目的普通用户分发方案 |

Google 对 Windows/macOS 的商店外安装有明确限制；开发者模式和受管理的企业分发有各自的适用条件。参见 [Chrome 官方安装说明](https://developer.chrome.com/docs/extensions/how-to/distribute/install-extensions)。

## 制作 ZIP

在仓库根目录运行（需要 Node 22+，Windows 使用系统 PowerShell；其他平台需 `zip`）：

```sh
npm run package
```

输出为 `dist/readme-html-v0.1.2.zip`、对应的 `.sha256` 校验文件，以及用于检查的同名解压目录。命令只收集明确列出的运行文件、PNG 图标和 MIT 许可证，核对 manifest 与 package 版本；已有同名输出时会停止，避免覆盖之前的候选包。需要重新打包时，先保留或明确移走原输出。

ZIP 根目录直接包含 `manifest.json`、后台及内容脚本、`viewer.html`、`viewer.js`、`icons/` 和 `LICENSE`。SVG 源稿、`node_modules`、测试文件和报告不会进入安装包。

验收最终安装包时，将 ZIP 解压到新目录，设置 `RHP_EXTENSION_PATH` 为该目录，再运行 `npm run test:browser -- --published`。这会加载实际解压内容，而不是源码中的 `extension/`。

此 ZIP 可供用户解压后加载。它不提供双击安装或自动更新；试用者升级时需替换文件、重新加载插件并刷新 GitHub。将 ZIP 作为 GitHub Release 附件分发，可让用户不用下载完整源码。

## GitHub Release 分发

[v0.1.2](https://github.com/luty4ng/readme-html/releases/tag/v0.1.2) 已设为普通 Release 和 Latest，附带 `readme-html-v0.1.2.zip` 和 `readme-html-v0.1.2.zip.sha256`。在 **Assets** 中下载具名插件 ZIP；GitHub 自动生成的 **Source code** 压缩包是完整源码，不能作为同一个安装目录直接加载。

后续按 [贡献与发版流程](../CONTRIBUTING.md#release) 操作：在分支提升版本并提 PR，检查通过后 Squash 合并到 `main`，再推送匹配的 `vX.Y.Z` 标签。Release 管线重新测试实际 ZIP，通过后自动附加安装包与 SHA-256，生成更新说明，并设为普通 Release 和 Latest。标签版本不一致、提交未进入 `main` 或测试失败时不会发布。已有版本不重新打包、不移动标签。

README 的提示词适用于可执行本地命令的 AI 助手：下载 → SHA-256 校验 → 解压到长期目录 → 加载到 Chrome → 验证公开演示。浏览器工具无法控制 `chrome://extensions` 时，应给出解压目录的绝对路径并引导用户点击完成，再确认结果。普通网页或仅能控制网页的工具无法保证自动完成 Chrome 扩展安装。

Chrome 商店也上传 ZIP，而不是自己生成的 CRX；商店要求 `manifest.json` 位于 ZIP 根目录。参见 [官方打包要求](https://developer.chrome.com/docs/webstore/prepare)。

## 上架前还需准备

当前已提供并在 manifest 注册 16、32、48、128 像素 PNG 图标；SVG 源文件位于 `assets/icon.svg`，可通过 `npm run icons` 重新生成。图标为本项目原创，采用根目录 MIT 许可证。商店提交还需要以下资料：

- 至少一张真实使用截图，尺寸为 1280×800 或 640×400。README 图片不应直接当成符合尺寸要求的商店截图。
- 商店简介、详细说明、支持链接、分类与语言。
- 单一用途说明、权限用途说明、真实的数据使用披露，以及可访问的 [隐私政策](../PRIVACY.md) 链接。
- 用于审核的测试步骤：打开公开示例仓库，等待预览，测试收起、目录和 FAQ。

图片规格见 [Chrome 官方素材要求](https://developer.chrome.com/docs/webstore/images)。隐私字段见 [官方填写说明](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)。

## 首次发布步骤

1. 使用负责长期维护的 Google 账号进入 [开发者控制台](https://chrome.google.com/webstore/devconsole)。
2. 注册 Chrome Web Store 开发者账号，按页面要求支付一次性注册费，并启用两步验证。具体费用与可用支付方式以控制台为准。
3. 补齐上面的资料，运行测试，制作 ZIP。
4. 在控制台点击 **Add new item**，上传上面的 ZIP。选择主要语言 English，填写 **Store listing** 的介绍、截图、支持链接和合适分类；可再添加简体中文商店文案。代码包与商店语言是不同设置，中英文 README 不会自动变成商店翻译。
5. 填写 **Privacy practices**：单一用途、权限理由、远程代码说明、数据使用披露及隐私政策 URL。按实际行为和当前表单定义填写；不要因为“没有自己的服务器”就跳过数据处理披露。
6. 在 **Distribution** 中选择面向公众的分发范围，确认无需付费；在 **Test instructions** 中填入下方测试步骤，无需提供测试账号。
7. 保存并检查控制台校验结果，点击 **Submit for review**。建议选择审核通过后手动发布，审核通过后在 30 天内发布，否则会退回草稿；也可选择审核通过后自动发布。

开源免费不免除开发者注册费。审核时间依具体项目而定，不能保证通过或固定天数。注册、付款、账号验证及最终提交应由仓库维护者使用自己的 Google 账号完成。

官方依据：[开发者注册](https://developer.chrome.com/docs/webstore/register)、[两步验证](https://developer.chrome.com/docs/webstore/program-policies/two-step-verification)、[发布流程](https://developer.chrome.com/docs/webstore/publish)。

## 可复制的商店文案

名称：`README HTML`。

英文简介（与当前 manifest 一致）：

```text
Preview static HTML on GitHub file pages and inline in READMEs with a #html-preview link.
```

英文详细说明：

```text
Preview static HTML directly on GitHub.

README HTML displays static documents below marked README links and automatically above the source on HTML file pages in public GitHub repositories. Keep reports, diagrams, and project overviews alongside your code, with no separate website to deploy.

How it works
1. Save a self-contained HTML file in your public repository.
2. Add a link such as [View report](./docs/report.html#html-preview) in its own README paragraph.
3. Open the README with the extension enabled. The document appears below the link.

Features
- Inline CSS, SVG diagrams, CSS charts, and native expandable sections.
- Multiple previews, collapse/expand, manual resizing, and retry on failure.
- The original GitHub file link remains available to readers without the extension.

Current limits
Chrome 120+ and public repositories on github.com. Same-repository UTF-8 HTML files up to 1 MiB. JavaScript, external resources, private repositories, and GitHub Enterprise are not supported. Documents must include their styles and assets inline.

Privacy
No account, analytics, or third-party preview server. Public HTML is fetched directly from GitHub Raw without cookies or authentication credentials and processed in browser memory. GitHub receives these file requests. Scripts and external resources are blocked in the isolated document preview.

Free and open source under the MIT license. This is an independent project, not affiliated with GitHub or Google.

Demo and source: https://github.com/luty4ng/readme-html
Support: https://github.com/luty4ng/readme-html/issues
Privacy: https://github.com/luty4ng/readme-html/blob/main/PRIVACY.md
```

测试说明（Test instructions）：

```text
No account, login, API key, or paid subscription is required.
1. Install the submitted extension in Chrome 120 or later.
2. Open https://github.com/luty4ng/readme-html and refresh if necessary.
3. Scroll to "Live demo". The link "Open the visual project overview" references demo/project-overview.en.html#html-preview.
4. A preview should appear below that link. It contains an English-language project overview, SVG/CSS charts, and sample metrics labeled Mock data.
5. Use the document's table of contents, expand an FAQ, collapse/reopen the preview, and drag its lower edge to resize it.
6. Repeat on https://github.com/luty4ng/readme-html/blob/main/docs/zh-CN/README.md under the Chinese demo section. Its separate demo/project-overview.html document contains the matching Chinese overview, charts, and FAQ.
7. Open https://github.com/luty4ng/readme-html/blob/main/demo/project-overview.html without a marker. Confirm a preview appears above the original source; test Source, Collapse/Expand, and the FAQ.
The extension has no toolbar popup. Its single purpose is static HTML document previews on GitHub.
```

## 本项目可采用的审核说明

单一用途：在 GitHub 上预览同一公开仓库的静态 HTML 文档，包括 README 标记链接下方和 HTML 文件页源码上方的预览。

GitHub 页面访问：识别当前仓库、README 标记链接和 HTML 文件页源码区域，在对应位置插入预览控件；文件页请求仅绑定浏览器报告的当前文件地址。

Raw 主机访问：读取经过校验的同仓库公开 HTML。请求不携带 cookie 或认证凭据，不用于读取私有仓库。

远程内容：下载的是要展示的文档数据。仓库脚本不会执行，外部资源被禁用；扩展自身的运行逻辑包含在上传包内。应据此如实填写远程代码与数据处理问题，并由 Google 审核判断。

英文权限说明可分别填入对应字段：

```text
Single purpose:
Preview same-repository static HTML documents below marked README links and above the source on public GitHub HTML file pages.

GitHub page access:
Identify the current repository, marked README links, and HTML file-page source containers to insert preview controls. File-page fetches are bound to the current HTML URL reported by the browser.

raw.githubusercontent.com host permission:
Fetch the validated public HTML file from the same repository. Requests omit cookies and authentication credentials. The extension does not access private repositories.

Remote code explanation:
All executable extension code is bundled in the submitted package. Downloaded repository HTML is treated as document data. Its scripts and event handlers are removed, and its preview sandbox blocks script execution and external resources.
```

## 后续版本

同步提升 `extension/manifest.json`、`package.json` 和锁文件的版本号，重新打包并上传同一个商店项目；不要为每次更新创建新的商店条目。更新隐私披露与截图以匹配实际行为。正式商店安装后的更新由 Chrome 分发。
