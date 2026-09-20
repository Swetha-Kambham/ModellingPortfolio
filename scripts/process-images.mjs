import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import heicConvert from "heic-convert";

const MAX_DIM = 2200;
const QUALITY = 82;

async function toJpegBuffer(inputPath) {
  const buf = fs.readFileSync(inputPath);
  if (/\.heic$/i.test(inputPath)) {
    const jpegBuf = await heicConvert({ buffer: buf, format: "JPEG", quality: 0.92 });
    return jpegBuf;
  }
  return buf;
}

async function processOne(inputPath, outputPath) {
  const jpegBuf = await toJpegBuffer(inputPath);
  await sharp(jpegBuf)
    .rotate() // auto-orient from EXIF
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outputPath);
}

function slugify(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function processDir(inDir, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(inDir).filter((f) => /\.(jpe?g|heic)$/i.test(f));
  const manifest = [];
  for (const file of files) {
    const slug = slugify(file);
    const outName = `${slug}.jpg`;
    const inputPath = path.join(inDir, file);
    const outputPath = path.join(outDir, outName);
    process.stdout.write(`processing ${file} -> ${outName} ... `);
    await processOne(inputPath, outputPath);
    const stat = fs.statSync(outputPath);
    console.log(`${(stat.size / 1024).toFixed(0)}KB`);
    manifest.push({ original: file, file: outName, slug });
  }
  return manifest;
}

const root = path.resolve(import.meta.dirname, "..");
const generalManifest = await processDir(
  path.join(root, "raw/general"),
  path.join(root, "public/images/general")
);
const digitalsManifest = await processDir(
  path.join(root, "raw/digitals"),
  path.join(root, "public/images/digitals")
);

fs.writeFileSync(
  path.join(root, "scripts/manifest.json"),
  JSON.stringify({ general: generalManifest, digitals: digitalsManifest }, null, 2)
);
console.log("Done. Manifest written to scripts/manifest.json");
