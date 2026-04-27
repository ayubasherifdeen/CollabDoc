import { useState } from "react";

type Props = {
  onJoin: (name: string, color: string) => void;
  onCancel?: () => void;
};

const COLORS = [
  "#f97316", // orange
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
];

const JoinModal: React.FC<Props> = ({ onJoin, onCancel }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState("");

  const handleJoin = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    onJoin(trimmed, color);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleJoin();
    if (e.key === "Escape") onCancel?.();
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm" onClick={onCancel}>

      {/* Modal card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-[modalIn_0.25s_ease_both]" onClick={(e) => e.stopPropagation()}>
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Header strip */}
        <div className="px-7 pt-7 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span
              className="text-[18px] font-semibold text-stone-800 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Collab<span className="text-orange-600">Doc</span>
            </span>
          </div>
          <p className="text-[13px] text-stone-400 mt-2">
            Enter your name so collaborators know who you are.
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-stone-500 uppercase tracking-widest">
              Your name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Alex, Jordan…"
              maxLength={30}
              className={`
                w-full px-4 py-2.5 rounded-lg border text-[14px] text-stone-800
                placeholder:text-stone-300 outline-none transition-all duration-150
                ${error
                  ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-stone-200 bg-stone-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white"
                }
              `}
            />
            {error && (
              <span className="text-[12px] text-red-500 font-medium">{error}</span>
            )}
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-stone-500 uppercase tracking-widest">
              Your color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={c}
                  className="w-7 h-7 rounded-full border-2 transition-all duration-100 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: c,
                    borderColor: color === c ? c : "transparent",
                    boxShadow: color === c ? `0 0 0 3px ${c}30` : "none",
                    transform: color === c ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  {color === c && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-lg border border-stone-100">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: color }}
            >
              {name.trim().slice(0, 2).toUpperCase() || "??"}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-stone-700">
                {name.trim() || "Your name"}
              </span>
              <span className="text-[11px]" style={{ color }}>● Online</span>
            </div>
            <span className="ml-auto text-[11px] text-stone-400 italic">
              Preview
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-all duration-150"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleJoin}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-[0_2px_8px_rgba(234,88,12,0.25)] hover:shadow-[0_4px_12px_rgba(234,88,12,0.35)] hover:-translate-y-px"
          >
            Join document →
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinModal;