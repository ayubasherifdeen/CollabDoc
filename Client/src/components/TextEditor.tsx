import React from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"
import { useEffect, useState, useRef } from "react";

type Props = {
    onReady: (quill: Quill) => void;
    cursors?: Record<string, { position: number; color: string; name: string }>;
};

const TextEditor: React.FC<Props> = ({
  onReady,
  cursors = {},
}) => {
    const quillRef = useRef<Quill | null>(null)
    const containerRef = useRef<HTMLDivElement>(null);
    const [charCount, setCharCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
    const el = containerRef.current;
    if (!el || quillRef.current) return;

    const editorDiv = document.createElement("div")
    el.appendChild(editorDiv);

    const quill = new Quill(editorDiv,{
        theme:"snow",
        modules:{ toolbar: false },
        placeholder: "Begin writing here -  your words are synce live across all collaborators... ",
    })

    quillRef.current = quill;

    quill.on("text-change", () => {
      const text = quill.getText();
      const trimmed = text.trim();
      setCharCount(trimmed.length);
      setWordCount(trimmed ? trimmed.split(/\s+/).length : 0);
    });

    quill.root.addEventListener("focus", () => setIsFocused(true));
    quill.root.addEventListener("blur", () => setIsFocused(false));

    onReady(quill);

   
    el.style.height = "auto";
    el.style.height = Math.max(520, el.scrollHeight) + "px";

    return () => {
      quillRef.current = null;
      if (el) el.innerHTML = "";
    };
  }, []);
 
  
  const cursorEntries = Object.entries(cursors);
 
  return (
    <div className="flex flex-col gap-0">
        <style>{`
        .collab-paper .ql-editor {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 15.5px;
          font-weight: 300;
          line-height: 1.85;
          color: #1c1917;
          padding: 20px 28px 28px 64px;
          min-height: 520px;
          caret-color: #ea580c;
          letter-spacing: 0.01em;
        }
        .collab-paper .ql-editor.ql-blank::before {
          font-style: italic;
          color: #d4cdc5;
          font-weight: 300;
          left: 64px;
          right: 28px;
        }
        .collab-paper .ql-editor ::selection { background: #fed7aa; }
        .collab-paper .ql-container { border: none; font-size: inherit; }
        .collab-paper .ql-editor:focus { outline: none; }
        .collab-paper .ql-editor h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px;
          font-weight: 600;
          line-height: 1.3;
          color: #1c1917;
          margin-bottom: 8px;
        }
        .collab-paper .ql-editor h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.4;
          color: #1c1917;
          margin-bottom: 6px;
        }
        .collab-paper .ql-editor p { margin-bottom: 4px; }
        .collab-paper .ql-editor ul,
        .collab-paper .ql-editor ol { padding-left: 20px; }
        .collab-paper .ql-editor a { color: #ea580c; }
        .collab-paper .ql-editor blockquote {
          border-left: 3px solid #fed7aa;
          padding-left: 16px;
          color: #78716c;
          font-style: italic;
          margin: 12px 0;
        }
        .collab-paper .ql-editor code {
          background: #f5f5f4;
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 13.5px;
          color: #c2410c;
        }
      `}</style>
 
      {/* Paper card */}
      <div
        className={`
          bg-white border rounded-xl overflow-hidden relative
          transition-shadow duration-200
          ${isFocused
            ? "border-orange-300 shadow-[0_0_0_3px_rgba(234,88,12,0.10),0_4px_16px_rgba(28,25,23,0.08)]"
            : "border-stone-200 shadow-md"
          }
        `}
      >
 
        {/* Margin line */}
        <div className="absolute top-0 left-[52px] bottom-0 w-px bg-orange-100 pointer-events-none z-[1]" />
 
        
 
        {/* Remote-cursor chips — top-right overlay */}
        {cursorEntries.length > 0 && (
          <div className="absolute top-2 right-3 flex flex-col gap-1 z-10">
            {cursorEntries.map(([id, { color, name, position }]) => (
              <div
                key={id}
                className="flex items-center gap-1.5 bg-white rounded-full py-0.5 pl-1.5 pr-2.5 text-[11px] font-medium shadow-sm"
                style={{ border: `1.5px solid ${color}`, color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                {name} · {position}
              </div>
            ))}
          </div>
        )}
 
        {/* Quill mounts here, in place of text area */}
        <div ref={containerRef} className="relative z-[2]" />
        
      </div>
 
      {/* Stats footer */}
      <div className="flex items-center gap-4 px-1 pt-2 text-[11.5px] text-stone-400 tracking-wide">
        <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
        <span className="text-stone-200">·</span>
        <span>{charCount} characters</span>
        <div className="flex-1" />
        <span
          className={`flex items-center gap-1.5 transition-colors duration-200 ${
            isFocused ? "text-orange-500 font-medium" : "text-stone-400"
          }`}
        >
          {isFocused && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
          )}
          {isFocused ? "Editing" : "Click to edit"}
        </span>
      </div>
    </div>
  );
};

export default TextEditor;