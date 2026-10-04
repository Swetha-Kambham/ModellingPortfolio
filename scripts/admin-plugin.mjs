// Local-only photo manager. Runs inside `npm run dev` (never in the Netlify build)
// and backs the #/upload page: it saves uploaded photos into public/images/<project>/
// and edits content/site.json, so the next commit + push publishes them.
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { IMAGE_EXT, slugify } from "./lib/names.mjs";

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const contentPath = path.join(root, "content/site.json");

const readContent = () => JSON.parse(fs.readFileSync(contentPath, "utf8"));
const writeContent = (c) => fs.writeFileSync(contentPath, JSON.stringify(c, null, 2) + "\n");

function findProject(content, id) {
  const project = content.work.projects.find((p) => p.id === id);
  if (!project) throw new Error(`No project with id "${id}"`);
  return project;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Pick a filename in `dir` that doesn't overwrite an existing photo.
function uniqueName(dir, base) {
  let name = `${base}.jpg`;
  for (let i = 2; fs.existsSync(path.join(dir, name)); i++) name = `${base}-${i}.jpg`;
  return name;
}

const actions = {
  // Body: raw image bytes. Saves the photo only; call add-images afterwards so
  // site.json is written once per batch (each write reloads the page).
  async upload(req, url) {
    const project = slugify(url.searchParams.get("project") || "");
    const filename = url.searchParams.get("filename") || "photo.jpg";
    if (!project) throw new Error("Missing project");
    if (!IMAGE_EXT.test(filename)) throw new Error(`${filename}: only JPG, PNG, WEBP or HEIC photos`);
    const dir = path.join(root, "public/images", project);
    fs.mkdirSync(dir, { recursive: true });
    const name = uniqueName(dir, slugify(filename) || "photo");
    // Loaded lazily so the production build never needs the image tooling.
    const { toWebJpeg } = await import("./lib/images.mjs");
    fs.writeFileSync(path.join(dir, name), await toWebJpeg(await readBody(req), filename));
    return { src: `/images/${project}/${name}` };
  },

  async "add-images"(req) {
    const { projectId, images } = JSON.parse(await readBody(req));
    const content = readContent();
    const project = findProject(content, projectId);
    project.images.push(...images);
    if (!project.cover) project.cover = images[0];
    writeContent(content);
    return { ok: true };
  },

  async "create-project"(req) {
    const { title, category } = JSON.parse(await readBody(req));
    if (!title?.trim() || !category?.trim()) throw new Error("Title and category are required");
    const content = readContent();
    let id = slugify(title);
    for (let i = 2; content.work.projects.some((p) => p.id === id); i++) id = `${slugify(title)}-${i}`;
    content.work.projects.unshift({ id, title: title.trim(), category: category.trim(), cover: "", images: [] });
    writeContent(content);
    return { id };
  },

  async "update-project"(req) {
    const { projectId, ...changes } = JSON.parse(await readBody(req));
    const content = readContent();
    const project = findProject(content, projectId);
    for (const key of ["title", "category", "cover"]) {
      if (typeof changes[key] === "string") project[key] = changes[key].trim();
    }
    writeContent(content);
    return { ok: true };
  },

  async "move-image"(req) {
    const { projectId, src, delta } = JSON.parse(await readBody(req));
    const content = readContent();
    const { images } = findProject(content, projectId);
    const from = images.indexOf(src);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= images.length) return { ok: true };
    images.splice(to, 0, images.splice(from, 1)[0]);
    writeContent(content);
    return { ok: true };
  },

  // Removes the photo from the project; deletes the file if nothing else uses it.
  async "remove-image"(req) {
    const { projectId, src } = JSON.parse(await readBody(req));
    const content = readContent();
    const project = findProject(content, projectId);
    project.images = project.images.filter((s) => s !== src);
    if (project.cover === src) project.cover = project.images[0] || "";
    writeContent(content);
    deleteIfUnused(content, src);
    return { ok: true };
  },

  async "delete-project"(req) {
    const { projectId } = JSON.parse(await readBody(req));
    const content = readContent();
    const project = findProject(content, projectId);
    content.work.projects = content.work.projects.filter((p) => p !== project);
    writeContent(content);
    for (const src of project.images) deleteIfUnused(content, src);
    return { ok: true };
  },

  async status() {
    const { stdout: branch } = await run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: root });
    const { stdout } = await run("git", ["status", "--porcelain", "--", "content", "public/images"], { cwd: root });
    return { branch: branch.trim(), changes: stdout.split("\n").filter(Boolean).length };
  },

  async publish() {
    const opts = { cwd: root };
    await run("git", ["add", "--", "content", "public/images"], opts);
    const { stdout: staged } = await run("git", ["diff", "--cached", "--name-only"], opts);
    if (!staged.trim()) return { message: "Nothing new to publish." };
    await run("git", ["commit", "-m", "Update portfolio photos"], opts);
    const { stdout: branch } = await run("git", ["rev-parse", "--abbrev-ref", "HEAD"], opts);
    await run("git", ["push", "-u", "origin", branch.trim()], opts);
    return { message: `Committed and pushed to "${branch.trim()}".` };
  },
};

function deleteIfUnused(content, src) {
  if (!src.startsWith("/images/") || JSON.stringify(content).includes(`"${src}"`)) return;
  const file = path.join(root, "public", src);
  if (!fs.existsSync(file)) return;
  fs.unlinkSync(file);
  const dir = path.dirname(file);
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

export default function adminPlugin() {
  return {
    name: "local-photo-admin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__admin", async (req, res) => {
        const url = new URL(req.url, "http://localhost");
        const action = actions[url.pathname.slice(1)];
        res.setHeader("Content-Type", "application/json");
        if (!action || (req.method !== "POST" && url.pathname !== "/status")) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: "Unknown action" }));
        }
        try {
          res.end(JSON.stringify(await action(req, url)));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.stderr?.trim() || err.message }));
        }
      });
    },
  };
}
