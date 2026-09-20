import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import content from "../content.js";
import Lightbox from "../components/Lightbox.jsx";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const project = content.work.projects.find((p) => p.id === projectId);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!project) return <Navigate to="/work" replace />;

  return (
    <div className="container">
      <div className="page-head">
        <Link to="/work" className="back-link">
          &larr; All Work
        </Link>
        <h1 className="page-head__title">{project.title}</h1>
        <p className="label" style={{ marginTop: 10, color: "var(--ink-soft)" }}>
          {project.category}
        </p>
      </div>

      <div className="photo-grid" style={{ paddingBottom: 72 }}>
        {project.images.map((src, i) => (
          <button key={src} onClick={() => setLightboxIndex(i)}>
            <div className="photo-grid__img-wrap">
              <img src={src} alt={`${project.title} ${i + 1}`} />
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        images={project.images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
