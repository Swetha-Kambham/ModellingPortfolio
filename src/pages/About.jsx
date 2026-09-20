import content from "../content.js";

export default function About() {
  const { about, site } = content;

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-head__title">About</h1>
      </div>

      <div className="about-grid" style={{ paddingBottom: 80 }}>
        <div>
          <p className="about-bio">{about.bio}</p>
          <ul className="about-fact-list">
            <li>
              <span className="label">Based</span>
              <span>{site.location}</span>
            </li>
            <li>
              <span className="label">Representation</span>
              <span>{site.representation}</span>
            </li>
            <li>
              <span className="label">Instagram</span>
              <a href={site.instagramUrl} target="_blank" rel="noreferrer">
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
        <div className="about-photos">
          {about.images.map((src) => (
            <div className="about-photos__img-wrap" key={src}>
              <img src={src} alt={site.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
