import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "public/images/general");
const files = fs.readdirSync(dir).filter((f) => /\.jpg$/i.test(f)).sort();

const THUMB = 260;
const COLS = 5;
const PER_SHEET = 20;
const LABEL_H = 24;
const CELL_W = THUMB;
const CELL_H = THUMB + LABEL_H;

async function makeSheet(batch, outPath) {
  const rows = Math.ceil(batch.length / COLS);
  const composites = [];
  for (let i = 0; i < batch.length; i++) {
    const file = batch[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const thumbBuf = await sharp(path.join(dir, file))
      .resize({ width: THUMB, height: THUMB, fit: "cover" })
      .toBuffer();
    composites.push({ input: thumbBuf, left: col * CELL_W, top: row * CELL_H });
    const label = Buffer.from(
      `<svg width="${CELL_W}" height="${LABEL_H}"><rect width="100%" height="100%" fill="white"/><text x="2" y="17" font-size="14" font-family="monospace" fill="black">${file.replace(/\.jpg$/, "")}</text></svg>`
    );
    composites.push({ input: label, left: col * CELL_W, top: row * CELL_H + THUMB });
  }
  await sharp({
    create: {
      width: COLS * CELL_W,
      height: rows * CELL_H,
      channels: 3,
      background: "white",
    },
  })
    .composite(composites)
    .jpeg({ quality: 78 })
    .toFile(outPath);
}

const outDir = path.join(root, "scripts/contact-sheets");
fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < files.length; i += PER_SHEET) {
  const batch = files.slice(i, i + PER_SHEET);
  const outPath = path.join(outDir, `sheet-${i / PER_SHEET + 1}.jpg`);
  await makeSheet(batch, outPath);
  console.log("wrote", outPath, batch.length);
}
