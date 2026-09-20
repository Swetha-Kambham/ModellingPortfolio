import content from "../content.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>
          &copy; {new Date().getFullYear()} {content.site.name}
        </span>
        <span>{content.site.location}</span>
        <a href={`mailto:${content.site.email}`}>{content.site.email}</a>
      </div>
    </footer>
  );
}
