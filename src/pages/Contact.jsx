import content from "../content.js";

export default function Contact() {
  const { site } = content;

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-head__title">Contact</h1>
        <p style={{ marginTop: 18, maxWidth: "40ch", color: "var(--ink-soft)" }}>
          For bookings and inquiries, reach out directly.
        </p>
      </div>

      <div className="contact-grid" style={{ paddingBottom: 80 }}>
        <div className="contact-item">
          <div className="contact-item__label label">Email</div>
          <a className="contact-item__value" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className="contact-item">
          <div className="contact-item__label label">Instagram</div>
          <a
            className="contact-item__value"
            href={site.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            {site.instagramHandle}
          </a>
        </div>
        <div className="contact-item">
          <div className="contact-item__label label">Location</div>
          <div className="contact-item__value">{site.location}</div>
        </div>
        <div className="contact-item">
          <div className="contact-item__label label">Representation</div>
          <div className="contact-item__value">{site.representation}</div>
        </div>
      </div>
    </div>
  );
}
