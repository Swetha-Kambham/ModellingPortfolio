// Dependency-free helpers, safe to load from vite.config.js during the Netlify build.
export const IMAGE_EXT = /\.(jpe?g|png|webp|heic|heif)$/i;

export function slugify(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
