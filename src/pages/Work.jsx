import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import content from "../content.js";

export default function Work() {
  const { projects } = content.work;
  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    [projects]
  );
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-head__title">Work</h1>
      </div>

      <div className="filter-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn${active === cat ? " active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {visible.map((project) => (
          <Link to={`/work/${project.id}`} className="project-card" key={project.id}>
            <div className="project-card__img-wrap">
              <img src={project.cover} alt={project.title} />
            </div>
            <div className="project-card__meta">
              <span className="project-card__title">{project.title}</span>
              <span className="project-card__count">
                {project.images.length} photos
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
