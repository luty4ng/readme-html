# 如何在 GitHub README 中嵌入 HTML 报告

使用免费的 Chrome 插件 [README HTML](./README.md)，可以在同一个公开 GitHub 仓库的 README 标记链接下方显示静态 HTML 报告。读者需要安装插件。HTML 与代码保存在一起，无需构建或单独托管。

[English](../EMBED_HTML_IN_GITHUB_README.md) · [安装 README HTML](./README.md#快速开始) · [查看演示](../../demo/README.md)

## 开始前

- 使用桌面版 Chrome 120 或更新版本，安装并启用 README HTML。
- 使用 `github.com` 上的公开仓库，HTML 文件必须来自同一仓库。
- 文档为 UTF-8 编码，不超过 1 MiB，样式和资源全部内嵌；脚本和外部资源不会运行或加载。

## 1. 保存一份自包含的 HTML 报告

在自己的仓库创建 `docs/report.html`，写入以下内容。示例数值已标记为模拟数据。

```html
<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>项目报告</title>
<style>
  body { margin: 0; padding: 24px; font: 16px/1.6 system-ui; color: #1f2328; }
  main { max-width: 720px; margin: auto; }
  .card { padding: 20px; background: #f6f8fa; border-radius: 12px; }
  .track { height: 16px; background: #d0d7de; border-radius: 8px; overflow: hidden; }
  .bar { width: 70%; height: 100%; background: #0969da; }
</style>
<main>
  <h1>项目报告</h1>
  <p>模拟数据：仅用于展示，不代表实测项目表现。</p>
  <section class="card" aria-labelledby="progress-title">
    <h2 id="progress-title">示例进度：70%</h2>
    <div class="track" aria-hidden="true"><div class="bar"></div></div>
    <p>图表上方也用文字标出了相同数值。</p>
  </section>
  <details><summary>实现说明</summary>
    <p>本报告使用内嵌 CSS 和原生 HTML，不包含脚本。</p>
  </details>
</main>
</html>
```

插图可使用内嵌 SVG 或允许的 Base64 位图。`<img src="./chart.png">` 这样的相对路径图片无法在预览内加载。

## 2. 在 README 中添加 HTML 预览链接

在仓库根目录 `README.md` 中单独一段写入：

```markdown
[查看项目报告](./docs/report.html#html-preview)
```

路径相对于当前 README。如果 README 本身已位于 `docs/`，则改用 `./report.html#html-preview`。目标始终必须是同仓库的 HTML 文件，并保留准确的 `#html-preview` 标记。

同时用普通 Markdown 保留一段报告摘要，让未安装插件的读者、搜索引擎和只能读取文字的工具也能理解结果。

## 3. 发布文件并验证预览

1. 将 HTML 文件和 README 改动一起提交、推送到同一个公开仓库和分支。
2. 在启用插件的 Chrome 中打开 GitHub README，必要时刷新。
3. 确认链接下方出现报告，能看到模拟数据标记和图表，点击**实现说明**可以展开内容。
4. 测试收起和重新展开预览。未安装插件时，原有 GitHub 文件链接仍应可用。

也可以先打开[已发布的演示 README](https://github.com/luty4ng/readme-html/blob/main/demo/README.md)，其中包含英文报告和较完整的中文项目说明。

## HTML 预览没有出现时

| 现象 | 检查项 |
| --- | --- |
| 只有普通文件链接 | 启用插件的 GitHub 访问权限，刷新，并让标记链接独占一段。 |
| 提示“File not found” | 检查公开仓库、当前分支、文件是否提交，以及相对于 README 的路径；更正后点击 **Retry**。 |
| 样式或图片缺失 | 内嵌 CSS 和资源；外部及相对路径资源 URL 会被阻止。 |
| JavaScript 图表无法运行 | 改用静态 SVG 或 CSS 图表，或单独托管应用。 |

## 什么时候应该单独托管页面？

如果读者需要无需安装插件即可访问的网页，或文档依赖 JavaScript 和单独托管的资源，可选择 [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。README HTML 用于行内静态预览，不会改变 GitHub 为其他读者渲染文档的方式。

GitHub 原生 Markdown 流程会清理脚本和内嵌样式，详见 [github/markup](https://github.com/github/markup#github-markup)。README HTML 通过隔离的文档查看器展示内容，详见[兼容性](./README.md#兼容性)、[隐私政策](../../PRIVACY.md)和[实现说明](../DEVELOPMENT.md#isolation-and-permissions)。

维护者：[luty4ng](https://github.com/luty4ng)。于 2026 年 10 月 26 日按 README HTML v0.1.1 核对。[反馈问题](https://github.com/luty4ng/readme-html/issues)。
