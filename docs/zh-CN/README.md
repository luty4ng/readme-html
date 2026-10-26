<div align="center">

<img src="../../extension/icons/icon-128.png" width="112" height="112" alt="README HTML">

# README HTML

### 让 HTML 文档，直接出现在 GitHub README 里。

**一条 Markdown 链接，就能展示可视化文档。**<br>
让报告、图表和项目说明与代码放在一起。<br>
通过免费、开源的 Chrome 插件，在 README 中直接阅读。

[![版本](https://img.shields.io/badge/version-0.1.1-0969da)](https://github.com/luty4ng/readme-html/releases/tag/v0.1.1)
![Chrome 120+](https://img.shields.io/badge/Chrome-120%2B-4285F4)
[![MIT 许可证](https://img.shields.io/badge/license-MIT-34d399)](../../LICENSE)

**[下载插件](https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip)** · **[在线演示](#在线演示)** · [文档](#文档) · [反馈问题](https://github.com/luty4ng/readme-html/issues)

[English](../../README.md) · **简体中文**

<br>

<img src="../images/preview.png" width="900" alt="README HTML 在真实 GitHub README 中展示带图表和结构示意的项目说明">

<sub>本仓库中的真实插件预览。文档中的示例指标均为 Mock 数据。</sub>

</div>

<br>

> [!NOTE]
> **开发预览版 · Chrome 120+ · GitHub 公开仓库。** 目前通过开发者模式安装，尚未在 Chrome 应用商店上架。

## 适合什么场景？

你已经有一份 HTML 报告、架构说明或 AI 生成的文档，希望读者浏览代码时，就能直接看到它。

- **在读者熟悉的地方展示文档。** 报告、项目总览、图表和对比表都能与代码一起阅读。
- **一条链接即可嵌入。** 支持内嵌 CSS、SVG 示意图、CSS 图表和可展开的常见问题，无需额外部署网站。
- **免费且开源。** MIT 许可证，无需账号、API Key、后台或统计服务，也没有运行时依赖。

README 仍然是普通 Markdown。安装插件后，下面这样的链接会在原位置下方展示静态预览：

```markdown
[查看报告](./docs/report.html#html-preview)
```

## 快速开始

**1 · 安装插件。**

下载并解压 [v0.1.1 ZIP](https://github.com/luty4ng/readme-html/releases/download/v0.1.1/readme-html-v0.1.1.zip)。打开 `chrome://extensions`，开启**开发者模式**，点击**加载已解压的扩展程序**，选择包含 `manifest.json` 的文件夹。

**2 · 打开演示。**

访问[本仓库](https://github.com/luty4ng/readme-html)或本页的[在线演示](#在线演示)。若页面已经打开，先刷新。文档会自动显示在标记链接下方，无需点击工具栏按钮。

**3 · 添加自己的文档。**

将自包含的 HTML 文件放入公开仓库，在 README 中添加标记链接，然后提交两个文件。具体步骤见[嵌入自己的文档](#嵌入自己的文档)，无需构建或额外托管。

<details>
<summary>从源码安装，或更新已安装的版本</summary>

```sh
git clone https://github.com/luty4ng/readme-html.git
```

在 `chrome://extensions` 中加载仓库里的 `extension` 文件夹即可。

通过开发者模式安装的插件不会自动更新。替换解压文件或拉取最新源码后，点击插件卡片上的**重新加载**，再刷新 GitHub。使用期间请保留该文件夹。

</details>

## 在线演示

启用插件后，下方链接后会直接出现可视化项目说明：

[打开可视化项目说明](../../demo/project-overview.html#html-preview)

可以点击文档目录、展开常见问题，再试试收起预览或拖动底边调整高度。示例包含 SVG 示意图、CSS 柱状图与环形图，以及兼容性表格；所有示例指标均标记为 **Mock data**。

未安装插件的读者仍可访问原有的 GitHub 文件链接，并通过顶部截图了解渲染效果。也可以查看[更小的英文示例](../../demo/README.md)。

## 嵌入自己的文档

1. 在**公开 GitHub 仓库**中保存一份自包含的 UTF-8 HTML 文档，例如 `docs/report.html`。
2. 在根目录 README 中，单独一段写入：

   ```markdown
   [查看报告](./docs/report.html#html-preview)
   ```

3. 提交两个文件，启用插件后在 GitHub 打开 README，预览会出现在链接下方。

路径应相对于当前 README，HTML 必须属于同一个仓库，不需要 GitHub Pages。

<details>
<summary>可以直接使用的最小 HTML 示例</summary>

将以下内容保存为 `docs/report.html`：

```html
<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>项目报告</title>
<style>body{font:16px/1.6 system-ui;padding:24px;color:#1f2328}h1{color:#0969da}</style>
<h1>项目报告</h1>
<p>这份文档与代码保存在同一个仓库。</p>
<details><summary>实现说明</summary><p>内嵌 CSS 和原生 HTML 无需 JavaScript。</p></details>
</html>
```

</details>

**使用 AI 生成报告？** 可以要求：单个 UTF-8 HTML 文件，内嵌 CSS，使用 SVG 或 CSS 绘制图表，不使用 JavaScript 和外部资源。

## 兼容性

| 当前支持 | 使用边界 |
| --- | --- |
| 仓库首页、含 README 的目录页、独立 `README.md` / `README.markdown` 页面 | 仅 github.com 上的公开仓库 |
| 同仓库 `.html` / `.htm` 文件，以 `#html-preview` 标记 | UTF-8 编码；不超过 1 MiB；请求超时 15 秒 |
| 内嵌 CSS、SVG、Base64 位图和 data 字体 | 禁止加载外部样式、字体、图片及相对路径资源文件 |
| 多个预览、收起/展开、调整高度、重试和原生 `<details>` | 初始高度固定，长文档在预览内滚动 |
| GitHub 导航期间的 README 更新 | 特殊分支与路径组合仍需更广泛测试 |

当前不支持 JavaScript、私有仓库、GitHub Enterprise、GitLab、Issue/PR 页面及跨仓库预览。尚未手工验证 Edge 安装。

多语言文档需要在线预览时，可使用 `docs/zh-CN/README.md` 这样的语言目录；当前插件尚不能把 `README.zh-CN.md` 识别为独立的 README 页面。

## 隐私与隔离

插件读取 GitHub 中的标记链接，并直接向 `raw.githubusercontent.com` 请求公开 HTML，不携带 Cookie 或认证凭据。文档仅在浏览器内存中处理，不使用统计服务、账号、存储或第三方预览服务器。

文档在隔离的 iframe 中渲染，并受严格的内容安全策略约束。脚本、事件处理器、刷新指令、嵌套框架和外部资源/跳转属性会被移除。隔离后的文档仍可能包含误导性文字，预览器不会核实内容是否可信。

GitHub 会收到预览所需的文件请求。详见[隐私政策](../../PRIVACY.md)与[隔离机制](../DEVELOPMENT.md#isolation-and-permissions)。

## 常见问题

| 现象 | 排查方法 |
| --- | --- |
| 只有链接，没有预览 | 确认插件可访问 GitHub，刷新页面，并检查链接是否以 `#html-preview` 结尾、是否独占一段。 |
| 提示“File not found” | 确认 HTML 已提交、相对路径和分支正确，且仓库公开，再点击 **Retry**。 |
| 样式、图片或字体缺失 | 将 CSS 和资源内嵌。外部文件与相对路径文件被阻止，JavaScript 不会执行。 |

[提交问题](https://github.com/luty4ng/readme-html/issues)时，请提供 Chrome 版本、可公开访问的最小示例，以及预期与实际结果。不要包含令牌或私密内容。

## 文档

本地开发使用 Node 22+，Playwright 仅用于开发测试：

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

欢迎提交小范围修复和可复现的兼容性问题。

| 指南 | 内容 |
| --- | --- |
| [开发指南](../DEVELOPMENT.md) | 架构、权限、自动化测试与真实 GitHub 验证 |
| [上架与分发](../PUBLISHING.md) | ZIP 打包、商店材料与 Chrome 应用商店提交流程 |
| [隐私政策](../../PRIVACY.md) | 数据处理方式与用户选择 |
