// Local-only photo manager (only included when running `npm run dev`).
// Every change is written to content/site.json + public/images by the dev server
// (scripts/admin-plugin.mjs); "Publish" commits and pushes so Netlify redeploys.
import { useEffect, useState } from "react";
import content from "../content.js";

async function api(action, body) {
  const res = await fetch(`/__admin/${action}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

async function uploadFiles(projectId, files, onProgress) {
  const uploaded = [];
  for (const [i, file] of files.entries()) {
    onProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
    const params = new URLSearchParams({ project: projectId, filename: file.name });
    const res = await fetch(`/__admin/upload?${params}`, { method: "POST", body: file });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    uploaded.push(data.src);
  }
  // One write at the end: saving site.json hot-reloads the page with the new photos.
  await api("add-images", { projectId, images: uploaded });
}

function ProjectEditor({ project, onError }) {
  const [title, setTitle] = useState(project.title);
  const [category, setCategory] = useState(project.category);
  const [progress, setProgress] = useState("");
  const [dragging, setDragging] = useState(false);
  const edited = title !== project.title || category !== project.category;

  const call = (action, body) =>
    api(action, { projectId: project.id, ...body }).catch((e) => onError(e.message));

  const addFiles = async (fileList) => {
    const files = [...fileList].filter((f) => /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name));
    if (!files.length) return;
    try {
      await uploadFiles(project.id, files, setProgress);
    } catch (e) {
      onError(e.message);
    }
    setProgress("");
  };

  return (
    <section
      className={`upload-project${dragging ? " dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      }}
    >
      <div className="upload-project__head">
        <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
          list="upload-categories"
        />
        {edited && (
          <button className="upload-btn" onClick={() => call("update-project", { title, category })}>
            Save
          </button>
        )}
        <label className="upload-btn upload-btn--primary">
          + Add photos
          <input
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />
        </label>
        <button
          className="upload-btn upload-btn--danger"
          onClick={() => {
            if (confirm(`Delete "${project.title}" and its ${project.images.length} photos?`)) {
              call("delete-project");
            }
          }}
        >
          Delete project
        </button>
      </div>

      {progress && <p className="upload-status">{progress}</p>}

      {project.images.length === 0 ? (
        <p className="upload-empty">No photos yet — click "Add photos" or drag photos here.</p>
      ) : (
        <div className="upload-grid">
          {project.images.map((src, i) => (
            <figure key={src} className={src === project.cover ? "is-cover" : ""}>
              <img src={src} alt="" loading="lazy" />
              {src === project.cover && <span className="upload-badge">Cover</span>}
              <div className="upload-grid__actions">
                <button title="Move earlier" disabled={i === 0} onClick={() => call("move-image", { src, delta: -1 })}>
                  &larr;
                </button>
                <button
                  title="Move later"
                  disabled={i === project.images.length - 1}
                  onClick={() => call("move-image", { src, delta: 1 })}
                >
                  &rarr;
                </button>
                {src !== project.cover && (
                  <button title="Use as cover" onClick={() => call("update-project", { cover: src })}>
                    Cover
                  </button>
                )}
                <button
                  title="Remove photo"
                  onClick={() => confirm("Remove this photo?") && call("remove-image", { src })}
                >
                  &times;
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Upload() {
  const { projects } = content.work;
  const categories = [...new Set(projects.map((p) => p.category))];
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);
  const [publishMsg, setPublishMsg] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0] || "");

  useEffect(() => {
    api("status").then(setStatus).catch(() => setStatus(null));
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await api("create-project", { title: newTitle, category: newCategory });
      setNewTitle("");
    } catch (err) {
      setError(err.message);
    }
  };

  const publish = async () => {
    setPublishMsg("Publishing…");
    try {
      const { message } = await api("publish", {});
      setPublishMsg(message);
      setStatus(await api("status"));
    } catch (err) {
      setPublishMsg("");
      setError(err.message);
    }
  };

  return (
    <div className="container upload-page">
      <div className="page-head">
        <h1 className="page-head__title">Upload photos</h1>
        <p className="upload-intro">
          Only visible on your computer while running <code>npm run dev</code>. Changes save straight
          into the project files — check them on the site, then hit Publish.
        </p>
      </div>

      <div className="upload-publish">
        <span>
          {status
            ? `${status.changes} unpublished file change${status.changes === 1 ? "" : "s"} on branch "${status.branch}"`
            : "Checking for changes…"}
        </span>
        <button className="upload-btn upload-btn--primary" onClick={publish}>
          Publish (commit &amp; push)
        </button>
        {publishMsg && <span>{publishMsg}</span>}
      </div>

      {error && (
        <p className="upload-error" onClick={() => setError("")}>
          {error} (click to dismiss)
        </p>
      )}

      <datalist id="upload-categories">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <form className="upload-new" onSubmit={createProject}>
        <strong>New project</strong>
        <input placeholder="Title, e.g. Golden Hour" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <input
          placeholder="Category, e.g. Fashion"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          list="upload-categories"
        />
        <button className="upload-btn" type="submit" disabled={!newTitle.trim() || !newCategory.trim()}>
          Create
        </button>
      </form>

      {projects.map((project) => (
        <ProjectEditor key={project.id} project={project} onError={setError} />
      ))}
    </div>
  );
}
