import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import JoinModal from "../app/JoinModal";
import Document from "../app/Document";

type Identity = { name: string; color: string };
const STORAGE_KEY = "collabwrite_identity";

export default function EditorPage() {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();

  const [identity, setIdentity] = useState<Identity | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const [showModal, setShowModal] = useState(!identity);

  if (!docId) return <Navigate to="/" replace />;

  const handleJoin = (name: string, color: string) => {
    const id = { name, color };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(id));
    setIdentity(id);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 antialiased" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {showModal && (
        <JoinModal
          onJoin={handleJoin}
          onCancel={() => navigate("/")}
        />
      )}

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm h-[52px] flex items-center px-6 gap-4">
        <a href="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
          <div className="w-[28px] h-[28px] bg-orange-600 rounded-[7px] flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold text-stone-800 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Collab<span className="text-orange-600">Write</span>
          </span>
        </a>

        <div className="flex-1" />

        {identity && (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: identity.color }}
            >
              {identity.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-[13px] font-medium text-stone-600">{identity.name}</span>
            <button
              onClick={() => setShowModal(true)}
              className="ml-1 text-[11px] text-stone-400 hover:text-stone-600 transition-colors"
            >
              Change
            </button>
          </div>
        )}

        <span className="text-xs text-stone-400 ml-2">
          doc / <span className="text-stone-600 font-medium">{docId}</span>
        </span>
      </nav>

      <main className="flex justify-center px-5 pt-8 pb-20">
        {identity && !showModal && (
          <Document docId={docId} identity={identity} />
        )}
      </main>
    </div>
  );
}