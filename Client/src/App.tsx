import Document from "./components/Document";

function App() {
  const docId = window.location.pathname.replace("/", "") || "default";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-stone-50 antialiased"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Sticky nav */}
        <nav className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm h-[52px] flex items-center px-6 gap-4">
          {/* Logo mark */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
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

          <div className="flex-1" />

          <span className="text-xs text-stone-400">
            doc /{" "}
            <span className="text-stone-600 font-medium">{docId}</span>
          </span>
        </nav>

        {/* Page body */}
        <main className="flex justify-center px-5 pt-8 pb-20">
          <Document docId={docId} />
        </main>
      </div>
    </>
  );
}

export default App;