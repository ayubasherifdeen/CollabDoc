import { useState, useEffect } from "react";
import LandingPage from "./app/LandingPage";
import JoinModal from "./app/JoinModal";
import Document from "./app/Document";

type Identity = { name: string; color: string };
type Page = "landing" | "modal" | "editor";

const STORAGE_KEY = "collabwrite_identity";

function getDocId(): string | null {
  // Expects routes like /doc/:id
  const match = window.location.pathname.match(/^\/doc\/(.+)/);
  return match ? match[1] : null;
}

function App() {
  const docId = getDocId();

  const savedIdentity = (): Identity | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  // If no docId → landing page
  // If docId but no identity → modal
  // If docId and identity → editor
  const initialPage = (): Page => {
    if (!docId) return "landing";
    if (!savedIdentity()) return "modal";
    return "editor";
  };

  const [page, setPage] = useState<Page>(initialPage);
  const [identity, setIdentity] = useState<Identity | null>(savedIdentity);

  const handleJoin = (name: string, color: string) => {
    const id = { name, color };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(id));
    setIdentity(id);
    setPage("editor");
  };

  const handleCancel = () => {
    // Go back to landing — clear the doc URL too
    window.location.href = "/";
  };

  const handleChangeName = () => {
    setPage("modal");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
        rel="stylesheet"
      />

      {page === "landing" && <LandingPage />}

      {page === "modal" && (
        <JoinModal onJoin={handleJoin} onCancel={handleCancel} />
      )}

      {page === "editor" && identity && docId && (
        <div
          className="min-h-screen bg-stone-50 antialiased"
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          {/* Nav */}
          <nav className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm h-[52px] flex items-center px-6 gap-4">
            {/* Logo — clicking goes back to landing */}
            <a
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0 no-underline"
            >
              <div className="w-[28px] h-[28px] bg-orange-600 rounded-[7px] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span
                className="text-[17px] font-semibold text-stone-800 tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Collab<span className="text-orange-600">Write</span>
              </span>
            </a>

            <div className="flex-1" />

            {/* Identity */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                style={{ background: identity.color }}
              >
                {identity.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[13px] font-medium text-stone-600">
                {identity.name}
              </span>
              <button
                onClick={handleChangeName}
                className="ml-1 text-[11px] text-stone-400 hover:text-stone-600 transition-colors"
              >
                Change
              </button>
            </div>

            <span className="text-xs text-stone-400 ml-2">
              doc / <span className="text-stone-600 font-medium">{docId}</span>
            </span>
          </nav>

          <main className="flex justify-center px-5 pt-8 pb-20">
            <Document docId={docId} identity={identity} />
          </main>
        </div>
      )}
    </>
  );
}

export default App;