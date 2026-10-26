// Render the original SVG into Chrome's required PNG sizes. No runtime dependency.
const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");

(async () => {
  const root = path.resolve(__dirname, "..");
  const svg = await fs.readFile(path.join(root, "assets/icon.svg"), "utf8");
  const output = path.join(root, "extension/icons");
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({
    ...(process.env.RHP_CHROMIUM_EXECUTABLE ? { executablePath: process.env.RHP_CHROMIUM_EXECUTABLE } : {}),
    headless: true
  });
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    for (const size of [16, 32, 48, 128]) {
      await page.setViewportSize({ width: size, height: size });
      await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style>${svg}`);
      await page.screenshot({ path: path.join(output, `icon-${size}.png`), omitBackground: true });
      console.log(`Generated ${size}x${size} PNG`);
    }
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
