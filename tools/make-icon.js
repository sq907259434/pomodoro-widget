/* 渲染倒计时卡图标：用 SVG 画，Electron 离屏截图，输出多尺寸 PNG 供打包成 ico */
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const OUT = path.join(__dirname, "_icon");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const SIZES = [256, 128, 64, 48, 32, 24, 16];

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:transparent;overflow:hidden}
  svg{display:block;width:100%;height:100%}
</style></head><body>
<svg id="i" width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="#3A3A3A"/>
      <stop offset="0.46" stop-color="#262626"/>
      <stop offset="1"    stop-color="#161616"/>
    </linearGradient>
    <linearGradient id="hi" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="tom" cx="0.36" cy="0.30" r="0.92">
      <stop offset="0"    stop-color="#FF8A6E"/>
      <stop offset="0.42" stop-color="#F2452E"/>
      <stop offset="1"    stop-color="#A81A12"/>
    </radialGradient>
    <radialGradient id="tomHi" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8BE05F"/>
      <stop offset="1" stop-color="#3E9E2E"/>
    </linearGradient>
  </defs>

  <!-- 底板（和卡片同一套深色玻璃） -->
  <rect x="56" y="56" width="912" height="912" rx="240" fill="url(#bg)"/>
  <rect x="56" y="56" width="912" height="912" rx="240" fill="url(#hi)"/>
  <rect x="57.5" y="57.5" width="909" height="909" rx="238.5"
        fill="none" stroke="#ffffff" stroke-opacity="0.13" stroke-width="3"/>

  <!-- 番茄身体 -->
  <circle cx="512" cy="604" r="288" fill="url(#tom)"/>
  <!-- 左上高光 -->
  <ellipse cx="404" cy="502" rx="112" ry="82" fill="url(#tomHi)" transform="rotate(-24 404 502)"/>

  <!-- 绿蒂：5 片放射叶 + 中心蒂头 -->
  <g fill="url(#leaf)" transform="translate(512 356)">
    <ellipse cx="0" cy="-70" rx="25" ry="86"/>
    <ellipse cx="0" cy="-70" rx="25" ry="86" transform="rotate(72)"/>
    <ellipse cx="0" cy="-70" rx="25" ry="86" transform="rotate(144)"/>
    <ellipse cx="0" cy="-70" rx="25" ry="86" transform="rotate(216)"/>
    <ellipse cx="0" cy="-70" rx="25" ry="86" transform="rotate(288)"/>
  </g>
  <circle cx="512" cy="356" r="26" fill="#2E7D22"/>
</svg>
</body></html>`;

app.on("window-all-closed", () => {});

app.whenReady().then(async () => {
  const f = path.join(OUT, "icon.html");
  fs.writeFileSync(f, html, "utf8");

  /* 只渲染一张 512（小窗口会撞到 Electron 的最小尺寸限制，所以用 nativeImage 缩） */
  const win = new BrowserWindow({
    show: false, width: 256, height: 256, useContentSize: true,
    transparent: true, frame: false,
    webPreferences: { offscreen: true, backgroundThrottling: false },
  });
  await win.loadFile(f);
  win.webContents.setZoomFactor(0.25);   /* 内容 256 -> 输出 512 */
  await new Promise((r) => setTimeout(r, 500));
  const big = await win.webContents.capturePage();
  fs.writeFileSync(path.join(OUT, "icon-512.png"), big.toPNG());
  console.log("base", JSON.stringify(big.getSize()));

  for (const px of SIZES) {
    const im = px >= 512 ? big : big.resize({ width: px, height: px, quality: "best" });
    fs.writeFileSync(path.join(OUT, `icon-${px}.png`), im.toPNG());
    console.log("saved", px, JSON.stringify(im.getSize()));
  }
  app.exit(0);
});
