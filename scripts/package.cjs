// Package only the explicit runtime files and original MIT license.
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "extension/manifest.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (manifest.version !== pkg.version) throw new Error("Manifest and package versions must match.");
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error("Unexpected release version.");
const files = ["manifest.json", "core.js", "background.js", "content.js", "viewer.html", "viewer.js", ...Object.values(manifest.icons)];
const output = process.env.RHP_PACKAGE_OUTPUT ? path.resolve(process.env.RHP_PACKAGE_OUTPUT) : path.join(root, "dist");
const staging = path.join(output, `readme-html-v${manifest.version}`);
if (fs.existsSync(staging)) throw new Error(`Staging already exists: ${staging}. Preserve or remove that output explicitly before repackaging.`);
fs.mkdirSync(staging, { recursive: true });
for (const file of files) {
  const destination = path.join(staging, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, "extension", file), destination);
}
fs.copyFileSync(path.join(root, "LICENSE"), path.join(staging, "LICENSE"));
const zip = path.join(output, `readme-html-v${manifest.version}.zip`);
if (fs.existsSync(zip)) throw new Error(`Package already exists: ${zip}`);
if (process.platform === "win32") {
  // Fixed command; paths are passed as environment values, never interpolated code.
  execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
    "Compress-Archive -Path (Join-Path $env:RHP_PACKAGE_STAGING '*') -DestinationPath $env:RHP_PACKAGE_ZIP"], {
    env: { ...process.env, RHP_PACKAGE_STAGING: staging, RHP_PACKAGE_ZIP: zip }, stdio: "inherit"
  });
} else {
  execFileSync("zip", ["-q", "-r", zip, "."], { cwd: staging, stdio: "inherit" });
}
const sha256 = createHash("sha256").update(fs.readFileSync(zip)).digest("hex");
fs.writeFileSync(`${zip}.sha256`, `${sha256}  ${path.basename(zip)}\n`);
console.log(JSON.stringify({ version: manifest.version, zip, staging, sha256 }, null, 2));
