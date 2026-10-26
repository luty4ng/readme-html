# How to embed an HTML report in a GitHub README

Use [README HTML](../README.md), a free Chrome extension, to display a static HTML report below a marked Markdown link in the same public GitHub repository. Readers need the extension installed. The HTML stays alongside the code; no separate hosting or build step is required.

[简体中文](./zh-CN/EMBED_HTML_IN_GITHUB_README.md) · [Install README HTML](../README.md#quick-start) · [Try the demo](../demo/README.md)

## Before you start

- Use desktop Chrome 120 or later with README HTML installed and enabled.
- Use a public repository on `github.com` and an HTML file from that repository.
- Keep the document self-contained, UTF-8 encoded, and no larger than 1 MiB. Inline its styles and assets; scripts and external resources will not run or load.

## 1. Save a self-contained HTML report

Create `docs/report.html` in your repository with the following content. The numbers are explicitly labeled mock data.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Project report</title>
<style>
  body { margin: 0; padding: 24px; font: 16px/1.6 system-ui; color: #1f2328; }
  main { max-width: 720px; margin: auto; }
  .card { padding: 20px; background: #f6f8fa; border-radius: 12px; }
  .track { height: 16px; background: #d0d7de; border-radius: 8px; overflow: hidden; }
  .bar { width: 70%; height: 100%; background: #0969da; }
</style>
<main>
  <h1>Project report</h1>
  <p>Mock data: a visual example, not measured project performance.</p>
  <section class="card" aria-labelledby="progress-title">
    <h2 id="progress-title">Example progress: 70%</h2>
    <div class="track" aria-hidden="true"><div class="bar"></div></div>
    <p>The same value is available as text above the chart.</p>
  </section>
  <details><summary>Implementation notes</summary>
    <p>This report uses inline CSS and native HTML, with no scripts.</p>
  </details>
</main>
</html>
```

Use inline SVG or permitted base64 raster images for illustrations. A reference such as `<img src="./chart.png">` will not load inside this preview.

## 2. Add the HTML preview link to your README

In the repository's root `README.md`, place this link in its own paragraph:

```markdown
[View the project report](./docs/report.html#html-preview)
```

The path is relative to the README. For a README already inside `docs/`, use `./report.html#html-preview` instead. In each case the destination must be an HTML file in the same repository. Keep the exact `#html-preview` marker.

Keep a short written summary of the report in ordinary Markdown too. Readers without the extension, search engines, and text-only tools should still be able to understand the result.

## 3. Publish the files and verify the preview

1. Commit and push the HTML file and README change to the same public repository and branch.
2. Open the README on GitHub in Chrome with the extension enabled, and refresh it if needed.
3. Confirm that the report appears below its link, the mock-data label and chart are visible, and **Implementation notes** expands when clicked.
4. Try collapsing and reopening the preview. Without the extension, confirm that the original GitHub file link is still usable.

For an existing example, open the [published demo README](https://github.com/luty4ng/readme-html/blob/main/demo/README.md). It contains both an English report and a larger Chinese project overview.

## When the HTML preview does not appear

| Symptom | Check |
| --- | --- |
| Only a normal file link appears | Enable the extension for GitHub, refresh, and keep the marked link in its own paragraph. |
| “File not found” | Check the public repository, current branch, committed file, and path relative to the README. Click **Retry** after correcting it. |
| Styling or images are missing | Inline CSS and assets. External and relative resource URLs are blocked. |
| A JavaScript chart does not run | Replace it with a static SVG or CSS chart, or host the application separately. |

## When to use a hosted page instead

Choose [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) when readers need a web page without installing an extension, or when the document depends on JavaScript and separately hosted assets. README HTML is for inline static previews; it does not change how GitHub renders documents for other readers.

GitHub's native Markdown pipeline sanitizes scripts and inline styles, as documented in [github/markup](https://github.com/github/markup#github-markup). README HTML keeps its document in an isolated viewer; see [compatibility](../README.md#compatibility), [privacy](../PRIVACY.md), and [implementation details](./DEVELOPMENT.md#isolation-and-permissions).

Maintained by [luty4ng](https://github.com/luty4ng). Checked against README HTML v0.1.1 on October 26, 2026. [Report an issue](https://github.com/luty4ng/readme-html/issues).
