import { useLocation } from "react-router-dom";

export default function PageFade({ children }) {
  const location = useLocation();
  return (
    <div className="page-fade" key={location.pathname}>
      {children}
    </div>
  );
}
