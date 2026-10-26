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

在仓库根目录运行 PowerShell：

```powershell
Compress-Archive -Path '.\extension\*', '.\LICENSE' -DestinationPath '.\readme-html-v0.1.0.zip' -Force
```

ZIP 根目录必须直接包含 `manifest.json`、后台及内容脚本、`viewer.html` 和 `viewer.js`。不要把整个仓库、`node_modules`、测试文件、凭据或签名私钥打包进去。

此 ZIP 可供用户解压后加载。它不提供双击安装或自动更新；试用者升级时需替换文件、重新加载插件并刷新 GitHub。将 ZIP 作为 GitHub Release 附件分发，可让用户不用下载完整源码。

Chrome 商店也上传 ZIP，而不是自己生成的 CRX；商店要求 `manifest.json` 位于 ZIP 根目录。参见 [官方打包要求](https://developer.chrome.com/docs/webstore/prepare)。

## 上架前还需准备

当前 ZIP 已能本地安装，但商店提交还需要以下资料：

- 在 manifest 中配置 PNG 图标，并在 ZIP 中包含 128×128 图标；小尺寸图标也应准备。
- 至少一张真实使用截图，尺寸为 1280×800 或 640×400。README 图片不应直接当成符合尺寸要求的商店截图。
- 商店简介、详细说明、支持链接、分类与语言。
- 单一用途说明、权限用途说明、真实的数据使用披露，以及可访问的 [隐私政策](../PRIVACY.md) 链接。
- 用于审核的测试步骤：打开公开示例仓库，等待预览，测试收起、目录和 FAQ。

图片规格见 [Chrome 官方素材要求](https://developer.chrome.com/docs/webstore/images)。隐私字段见 [官方填写说明](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)。

## 首次发布步骤

1. 使用负责长期维护的 Google 账号进入 [开发者控制台](https://chrome.google.com/webstore/devconsole)。
2. 注册 Chrome Web Store 开发者账号，按页面要求支付一次性注册费，并启用两步验证。具体费用与可用支付方式以控制台为准。
3. 补齐上面的图标和资料，运行测试，制作 ZIP。
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
