# 安装包与 Chrome 商店上架

当前版本为免费、MIT 开源的开发预览版，尚未在 Chrome Web Store 上架。

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

输出为 `dist/readme-html-v0.1.1.zip`、对应的 `.sha256` 校验文件，以及用于检查的同名解压目录。命令只收集明确列出的运行文件、PNG 图标和 MIT 许可证，核对 manifest 与 package 版本；已有同名输出时会停止，避免覆盖之前的候选包。需要重新打包时，先保留或明确移走原输出。

ZIP 根目录直接包含 `manifest.json`、后台及内容脚本、`viewer.html`、`viewer.js`、`icons/` 和 `LICENSE`。SVG 源稿、`node_modules`、测试文件和报告不会进入安装包。

验收最终安装包时，将 ZIP 解压到新目录，设置 `RHP_EXTENSION_PATH` 为该目录，再运行 `npm run test:browser -- --published`。这会加载实际解压内容，而不是源码中的 `extension/`。

此 ZIP 可供用户解压后加载。它不提供双击安装或自动更新；试用者升级时需替换文件、重新加载插件并刷新 GitHub。将 ZIP 作为 GitHub Release 附件分发，可让用户不用下载完整源码。

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
4. 在控制台添加新项目并上传 ZIP，填写 Store listing、Privacy practices、Distribution 和 Test instructions。
5. 设置为免费分发，检查所有披露与实现一致，然后提交审核。可以选择审核后手动发布。

开源免费不免除开发者注册费。审核时间依具体项目而定，不能保证通过或固定天数。注册、付款、账号验证及最终提交应由仓库维护者使用自己的 Google 账号完成。

官方依据：[开发者注册](https://developer.chrome.com/docs/webstore/register)、[两步验证](https://developer.chrome.com/docs/webstore/program-policies/two-step-verification)、[发布流程](https://developer.chrome.com/docs/webstore/publish)。

## 本项目可采用的审核说明

单一用途：在 GitHub README 中，就地展示同一公开仓库中由 `#html-preview` 链接引用的静态 HTML 文档。

GitHub 页面访问：识别当前仓库和 Markdown 中的标记链接，并在该位置插入预览控件。

Raw 主机访问：读取经过校验的同仓库公开 HTML。请求不携带 cookie 或认证凭据，不用于读取私有仓库。

远程内容：下载的是要展示的文档数据。仓库脚本不会执行，外部资源被禁用；扩展自身的运行逻辑包含在上传包内。应据此如实填写远程代码与数据处理问题，并由 Google 审核判断。

## 后续版本

提升 `extension/manifest.json` 的版本号，重新打包并上传同一个商店项目；不要为每次更新创建新的商店条目。更新隐私披露与截图以匹配实际行为。正式商店安装后的更新由 Chrome 分发。
