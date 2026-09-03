import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import PostFormPage from "./pages/PostFormPage";
import AdminProjectsPage from "./pages/AdminProjectsPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    // flex flex-col + min-h-screen + flex-1 (main'de):
    // icerik kisa olsa bile footer sayfanin ALTINA yapisir,
    // ekranin ortasinda asili kalmaz.
    <div className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* ATLAMA BAGLANTISI
          Klavye kullanicisi her sayfada once navbar'daki 6-7 baglantiyi
          gecmek zorunda kalmasin. Normalde gorunmez (sr-only), sadece
          Tab ile odaklaninca ekrana gelir (focus:not-sr-only). */}
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white dark:focus:bg-slate-100 dark:focus:text-slate-900"
      >
        İçeriğe geç
      </a>

      <ScrollToTop />
      <Navbar />

      {/* Genislik artik burada SABIT degil -- her sayfa kendi
          <Container size="..."> secimini yapiyor. Metin sayfalari dar,
          izgara sayfalari genis olabilsin diye. */}
      <main id="icerik" className="flex-1 py-12 sm:py-16">
        <Routes>
          {/* --- HERKESE ACIK --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* --- KORUMALI --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/new"
            element={
              <ProtectedRoute>
                <PostFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/:slug/edit"
            element={
              <ProtectedRoute>
                <PostFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/new"
            element={
              <ProtectedRoute>
                <ProjectFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/:slug/edit"
            element={
              <ProtectedRoute>
                <ProjectFormPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
