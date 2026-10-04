import { useState } from "react";
import { NavLink } from "react-router-dom";
import content from "../content.js";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/digitals", label: "Digitals" },
  { to: "/about", label: "About" },
  { to: "/motion", label: "Motion" },
  { to: "/contact", label: "Contact" },
  // Local-only photo manager (see src/pages/Upload.jsx).
  ...(import.meta.env.DEV ? [{ to: "/upload", label: "Upload" }] : []),
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <NavLink to="/" className="site-nav__name" onClick={() => setOpen(false)}>
          {content.site.name}
        </NavLink>
        <button className="site-nav__toggle" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
        <ul className={`site-nav__links${open ? " open" : ""}`}>
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
