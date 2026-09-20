import { Link } from "react-router-dom";
import content from "../content.js";

export default function Home() {
  const { home, work, site } = content;

  return (
    <div>
      <section className="hero">
        <div className="hero__image-wrap">
          <img src={home.heroImage} alt={site.name} />
        </div>
        <div className="hero__caption">
          <h1 className="hero__tagline">{site.tagline}</h1>
          <span className="label">{home.heroCaption}</span>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="section__title">Featured Work</h2>
          <Link to="/work" className="label">
            View All
          </Link>
        </div>
        <div className="strip">
          {work.projects.map((project) => (
            <Link to={`/work/${project.id}`} key={project.id}>
              <div className="strip__img-wrap">
                <img src={project.cover} alt={project.title} />
              </div>
              <div className="strip__label">{project.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--tight container">
        <div className="section__head">
          <h2 className="section__title">Highlights</h2>
        </div>
        <div className="highlights-strip">
          {home.highlights.map((src) => (
            <div className="highlights-strip__img-wrap" key={src}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
