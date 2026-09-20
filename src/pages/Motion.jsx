import content from "../content.js";

export default function Motion() {
  const { motion } = content;

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-head__title">Motion</h1>
      </div>

      <div style={{ paddingBottom: 80 }}>
        <div className="motion-placeholder">
          <div className="motion-placeholder__icon">&#9654;</div>
          <p className="label">{motion.note}</p>
        </div>
      </div>
    </div>
  );
}
