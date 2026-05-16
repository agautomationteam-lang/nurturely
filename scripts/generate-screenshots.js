const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = path.join(process.cwd(), "public", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

function svg(width, height, mobile = false) {
  const titleSize = mobile ? 34 : 58;
  const cardWidth = mobile ? 320 : 520;
  const x = mobile ? 35 : 690;
  const y = mobile ? 360 : 175;
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#FEFCF8"/>
    <circle cx="${width * 0.8}" cy="${height * 0.15}" r="${mobile ? 120 : 220}" fill="#D8F3DC" opacity="0.8"/>
    <circle cx="${width * 0.15}" cy="${height * 0.8}" r="${mobile ? 90 : 180}" fill="#F4A261" opacity="0.18"/>
    <g transform="translate(${mobile ? 28 : 56}, ${mobile ? 40 : 54})">
      <circle cx="28" cy="28" r="28" fill="#2D6A4F"/>
      <text x="28" y="39" text-anchor="middle" font-size="30" fill="white">♥</text>
      <text x="72" y="38" font-family="Inter, Arial" font-size="28" font-weight="700" fill="#1B4332">Nurturely</text>
    </g>
    <text x="${mobile ? 32 : 70}" y="${mobile ? 160 : 250}" font-family="Inter, Arial" font-size="${titleSize}" font-weight="800" fill="#1B4332">
      <tspan x="${mobile ? 32 : 70}" dy="0">Parenting support</tspan>
      <tspan x="${mobile ? 32 : 70}" dy="${titleSize * 1.15}">that helps you breathe.</tspan>
    </text>
    <rect x="${x}" y="${y}" width="${cardWidth}" height="${mobile ? 280 : 370}" rx="34" fill="#2D6A4F"/>
    <rect x="${x + 34}" y="${y + 42}" width="${cardWidth - 68}" height="110" rx="22" fill="white"/>
    <text x="${x + 62}" y="${y + 86}" font-family="Inter, Arial" font-size="${mobile ? 16 : 22}" font-weight="700" fill="#2D6A4F">You asked</text>
    <text x="${x + 62}" y="${y + 120}" font-family="Inter, Arial" font-size="${mobile ? 15 : 20}" fill="#1B4332">Is this normal?</text>
    <rect x="${x + 58}" y="${y + 180}" width="${cardWidth - 96}" height="${mobile ? 72 : 120}" rx="22" fill="#D8F3DC"/>
    <text x="${x + 86}" y="${y + 224}" font-family="Inter, Arial" font-size="${mobile ? 15 : 20}" fill="#1B4332">One calm next step.</text>
  </svg>`;
}

async function main() {
  await sharp(Buffer.from(svg(1280, 720))).png().toFile(path.join(outDir, "desktop.png"));
  await sharp(Buffer.from(svg(390, 844, true))).png().toFile(path.join(outDir, "mobile.png"));
  console.log("Generated PWA screenshots.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
