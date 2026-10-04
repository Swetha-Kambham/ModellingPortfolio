import sharp from "sharp";
import heicConvert from "heic-convert";

const MAX_DIM = 2200;
const QUALITY = 82;

export const IMAGE_EXT = /\.(jpe?g|png|webp|heic|heif)$/i;

export function slugify(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Resize + compress any supported photo (including iPhone HEIC) into a web-ready JPEG.
export async function toWebJpeg(buf, filename) {
  const input = /\.hei[cf]$/i.test(filename)
    ? await heicConvert({ buffer: buf, format: "JPEG", quality: 0.92 })
    : buf;
  return sharp(input)
    .rotate() // auto-orient from EXIF
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
}
