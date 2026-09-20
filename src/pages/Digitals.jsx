import { useState } from "react";
import content from "../content.js";
import Lightbox from "../components/Lightbox.jsx";

export default function Digitals() {
  const { digitals } = content;
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const images = digitals.map((d) => d.src);

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-head__title">Digitals</h1>
      </div>

      <div className="digitals-grid" style={{ paddingBottom: 72 }}>
        {digitals.map((d, i) => (
          <button
            key={d.src}
            onClick={() => setLightboxIndex(i)}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <div className="digital-card__img-wrap">
              <img src={d.src} alt={d.label} />
            </div>
            <div className="digital-card__label">{d.label}</div>
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
