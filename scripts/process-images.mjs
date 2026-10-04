// Bulk-convert photos: every folder in raw/<name>/ becomes public/images/<name>/.
// e.g. raw/fashion/IMG_1234.HEIC -> public/images/fashion/img-1234.jpg
import fs from "node:fs";
import path from "node:path";
import { IMAGE_EXT, slugify, toWebJpeg } from "./lib/images.mjs";

const root = path.resolve(import.meta.dirname, "..");
const rawDir = path.join(root, "raw");

if (!fs.existsSync(rawDir)) {
  console.log("No raw/ folder found. Put photos in raw/<folder-name>/ and run again.");
  process.exit(0);
}

for (const folder of fs.readdirSync(rawDir)) {
  const inDir = path.join(rawDir, folder);
  if (!fs.statSync(inDir).isDirectory()) continue;
  const outDir = path.join(root, "public/images", slugify(folder));
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of fs.readdirSync(inDir).filter((f) => IMAGE_EXT.test(f))) {
    const outName = `${slugify(file)}.jpg`;
    process.stdout.write(`${folder}/${file} -> ${path.relative(root, outDir)}/${outName} ... `);
    const out = await toWebJpeg(fs.readFileSync(path.join(inDir, file)), file);
    fs.writeFileSync(path.join(outDir, outName), out);
    console.log(`${(out.length / 1024).toFixed(0)}KB`);
  }
}
