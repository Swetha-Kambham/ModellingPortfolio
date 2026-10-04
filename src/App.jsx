import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import PageFade from "./components/PageFade.jsx";
import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Digitals from "./pages/Digitals.jsx";
import About from "./pages/About.jsx";
import Motion from "./pages/Motion.jsx";
import Contact from "./pages/Contact.jsx";

// Local photo manager: only bundled in `npm run dev`, never on the live site.
const Upload = import.meta.env.DEV ? lazy(() => import("./pages/Upload.jsx")) : null;

export default function App() {
  return (
    <>
      <Nav />
      <PageFade>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:projectId" element={<ProjectDetail />} />
          <Route path="/digitals" element={<Digitals />} />
          <Route path="/about" element={<About />} />
          <Route path="/motion" element={<Motion />} />
          <Route path="/contact" element={<Contact />} />
          {Upload && (
            <Route
              path="/upload"
              element={
                <Suspense fallback={null}>
                  <Upload />
                </Suspense>
              }
            />
          )}
        </Routes>
      </PageFade>
      <Footer />
    </>
  );
}
