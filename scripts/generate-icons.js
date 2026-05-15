const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(process.cwd(), "public", "icons");
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#2D6A4F"/>
  <circle cx="256" cy="256" r="168" fill="#D8F3DC"/>
  <path d="M256 356C223 330 194 307 169 283C141 257 128 231 128 202C128 178 136 158 153 143C169 128 189 120 212 120C231 120 247 126 256 137C265 126 281 120 300 120C323 120 343 128 359 143C376 158 384 178 384 202C384 231 371 257 343 283C318 307 289 330 256 356Z" fill="#2D6A4F"/>
  <path d="M197 231C211 253 231 264 256 264C281 264 301 253 315 231" fill="none" stroke="#FEFCF8" stroke-width="22" stroke-linecap="round"/>
</svg>`;

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await Promise.all(
    sizes.map((size) =>
      sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(path.join(outDir, `icon-${size}.png`))
    )
  );
  console.log(`Generated ${sizes.length} Nurturely PWA icons.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
