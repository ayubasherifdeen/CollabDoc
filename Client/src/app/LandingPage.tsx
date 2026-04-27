import { useState } from "react";
import { useNavigate } from "react-router-dom";

function genDocId() {
  return Math.random().toString(36).slice(2, 8);
}

const LandingPage: React.FC = () => {
  const [joinLink, setJoinLink] = useState("");
  const [linkError, setLinkError] = useState("");

  const navigate=useNavigate();

  const handleCreate = () => {
    const id = genDocId();
    navigate(`/doc/${id}`);
  };

  const handleJoin = () => {
    const trimmed = joinLink.trim();
    if (!trimmed) {
      setLinkError("Paste a document link or ID");
      return;
    }
    // Accept either a full URL or just the doc ID
    try {
      const url = new URL(trimmed);
      navigate(url.pathname);
    } catch {
      // Not a URL — treat as raw doc ID
      if (trimmed.length < 4) {
        setLinkError("That doesn't look like a valid document ID");
        return;
      }
      window.location.href = `/doc/${trimmed}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleJoin();
  };

  return (
    <div
      className="min-h-screen bg-stone-50 antialiased flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Nav */}
      <nav className="h-[52px] bg-white border-b border-stone-200 shadow-sm flex items-center px-6">
        <div className="flex items-center gap-2.5">
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
            Collab<span className="text-orange-600">Doc</span>
          </span>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1
            className="text-[48px] font-semibold text-stone-800 tracking-tight leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Write together,<br />
            <span className="text-orange-600">in real time.</span>
          </h1>
          <p className="text-[16px] text-stone-400 max-w-md mx-auto leading-relaxed">
            Create a document and share the link — your team can jump in instantly, no account needed.
          </p>
        </div>

        {/* Cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Create card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-stone-800">New document</div>
                <div className="text-[12px] text-stone-400">Start from scratch</div>
              </div>
            </div>

            <p className="text-[13px] text-stone-400 leading-relaxed">
              Creates a fresh document with a unique link you can share with anyone.
            </p>

            <button
              onClick={handleCreate}
              className="mt-auto w-full py-2.5 rounded-xl text-[14px] font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-all duration-150 shadow-[0_2px_8px_rgba(234,88,12,0.2)] hover:shadow-[0_4px_12px_rgba(234,88,12,0.3)] hover:-translate-y-px"
            >
              Create document →
            </button>
          </div>

          {/* Join card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-stone-800">Join document</div>
                <div className="text-[12px] text-stone-400">Open an existing one</div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                value={joinLink}
                onChange={(e) => { setJoinLink(e.target.value); setLinkError(""); }}
                onKeyDown={handleKeyDown}
                placeholder="Paste link or document ID…"
                className={`
                  w-full px-4 py-2.5 rounded-xl border text-[13px] text-stone-700
                  placeholder:text-stone-300 outline-none transition-all duration-150
                  ${linkError
                    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-stone-200 bg-stone-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                  }
                `}
              />
              {linkError && (
                <span className="text-[12px] text-red-500 font-medium">{linkError}</span>
              )}
            </div>

            <button
              onClick={handleJoin}
              disabled={!joinLink.trim()}
              className="mt-auto w-full py-2.5 rounded-xl text-[14px] font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-[0_2px_8px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-px"
            >
              Join document →
            </button>
          </div>
        </div>

        {/* Feature strip */}
        <div className="flex items-center gap-8 mt-14 flex-wrap justify-center">
          {[
            { icon: "⚡", label: "Real-time sync" },
            { icon: "🎨", label: "Cursor tracking" },
            { icon: "💾", label: "Auto-saved" },
            { icon: "🔗", label: "Share via link" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-[13px] text-stone-400">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[12px] text-stone-300">
        CollabWrite — built with React, Socket.IO & Quill
      </footer>
    </div>
  );
};

export default LandingPage;