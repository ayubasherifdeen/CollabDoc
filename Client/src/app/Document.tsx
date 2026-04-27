import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import Quill, { Delta } from "quill";

import Toolbar from "../components/Toolbar";
import TextEditor from "../components/TextEditor";
import UserPanel from "../components/UserPanel";

import { Document as DocxDocument,
   Paragraph,
    TextRun,
     HeadingLevel
     } from "docx";
import { saveAs } from "file-saver";


type Identity = { name: string; color: string };
type Props = { docId: string; identity: Identity };
type CursorInfo = { position: number; color: string; name: string };
type SaveStatus = "idle" | "saving" | "saved";

const Document: React.FC<Props> = ({ docId, identity }) => {
  const quillRef = useRef<Quill | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [users, setUsers] = useState<{ id: string; name: string; color: string }[]>([]);
  const [cursors, setCursors] = useState<Record<string, CursorInfo>>({});
  const [docTitle, setDocTitle] = useState("Untitled Document");
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [shareCopied, setShareCopied] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exportPDF = () =>{
    const editorContent = quillRef.current?.root.innerHTML;
  if (!editorContent) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${docTitle}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            font-size: 13pt;
            line-height: 1.8;
            color: #1c1917;
            max-width: 680px;
            margin: 40px auto;
            padding: 0 40px;
          }
          h1 { font-size: 22pt; margin-bottom: 12px; }
          h2 { font-size: 16pt; margin-bottom: 8px; }
          p  { margin-bottom: 6px; }
          ul, ol { padding-left: 24px; }
          blockquote {
            border-left: 3px solid #ccc;
            padding-left: 16px;
            color: #666;
            font-style: italic;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${docTitle}</h1>
        ${editorContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
  }

  const triggerSave = useCallback(() => {
    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus("saved");
      saveTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
    }, 700);
  }, []);

  // ── Quill ready — wire editor events only ─────────────────────────────────
  const handleQuillReady = useCallback(
    (quill: Quill) => {
      quillRef.current = quill;

      quill.on("text-change", (delta, _old, source) => {
        if (source !== "user") return;
        socketRef.current?.emit("text-change", {
          delta,
          contents: quill.getContents(),
        });
        triggerSave();
      });

      quill.on("selection-change", (range) => {
        if (!range) return;
        socketRef.current?.emit("cursor-move", {
          position: range.index,
          color: identity.color,
          name: identity.name,
        });
        const formats = quill.getFormat(range);
        setActiveFormats({
          bold: !!formats.bold,
          italic: !!formats.italic,
          underline: !!formats.underline,
        });
      });
    },
    [triggerSave, identity]
  );

  // ── Socket listeners ───────────────────────────────────────────────────────
  useEffect(() => {
     const socket = io("http://localhost:4000");
  socketRef.current = socket;
    // Send identity along with join so server knows who this is
    socketRef.current.emit("join-document", { docId, name: identity.name, color: identity.color });

    socketRef.current.on("load-document", (content: Delta) => {
      quillRef.current?.setContents(content, "silent");
    });

    socketRef.current.on("receive-changes", (delta: Delta) => {
      quillRef.current?.updateContents(delta, "api");
    });

    socketRef.current.on("users-update", (u: { id: string; name: string; color: string }[]) => {
      setUsers(u);
    });

    socketRef.current.on("receive-cursor", ({ id, position, color, name }: { id: string } & CursorInfo) => {
      setCursors((prev) => ({ ...prev, [id]: { position, color, name } }));
    });

    // Remove cursor when a user leaves
    socketRef.current.on("user-left", (id: string) => {
      setCursors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    });

    return () => {
     socketRef.current?.disconnect();
    };
  }, [docId, identity]);

  // ── Toolbar ────────────────────────────────────────────────────────────────
  const execFormat = useCallback((format: string, value: unknown = true) => {
    const quill = quillRef.current;
    if (!quill) return;
    const current = quill.getFormat();
    quill.format(format, current[format] ? false : value, "user");
    const updated = quill.getFormat();
    setActiveFormats({
      bold: !!updated.bold,
      italic: !!updated.italic,
      underline: !!updated.underline,
    });
  }, []);

  const execBlock = useCallback((format: string, value: unknown) => {
    const quill = quillRef.current;
    if (!quill) return;
    const current = quill.getFormat();
    quill.format(format, current[format] === value ? false : value, "user");
  }, []);

  const execHistory = useCallback((action: "undo" | "redo") => {
    const quill = quillRef.current;
    if (!quill) return;
    (quill as any).history?.[action]?.();
  }, []);

  useEffect(() => {
    if (isTitleEditing) titleInputRef.current?.focus();
  }, [isTitleEditing]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[860px] flex flex-col">

      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          {isTitleEditing ? (
            <input
              ref={titleInputRef}
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              onBlur={() => setIsTitleEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsTitleEditing(false)}
              className="text-[26px] font-semibold text-stone-800 tracking-tight bg-transparent border-b-2 border-orange-500 outline-none max-w-[440px] pb-0.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            />
          ) : (
            <h1
              onClick={() => setIsTitleEditing(true)}
              title="Click to rename"
              className="text-[26px] font-semibold text-stone-800 tracking-tight cursor-text border-b-2 border-transparent hover:border-stone-200 transition-colors duration-150 inline-flex items-center gap-2 pb-0.5 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {docTitle}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300 flex-shrink-0">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </h1>
          )}

          <div className="flex items-center gap-2.5 flex-wrap text-[12px] text-stone-400">
            <span>doc/{docId}</span>
            <span className="text-stone-200">·</span>
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1 text-orange-500 font-medium">
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.2" />
                  <path d="M21 12a9 9 0 00-9-9" />
                </svg>
                Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-emerald-500 font-medium">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved
              </span>
            )}
            {saveStatus === "idle" && <span>All changes saved</span>}
          </div>
        </div>
        {/* Export buttons */}
<div className="flex items-center gap-2">
  <button
    onClick={exportPDF}
    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all duration-150 shadow-sm"
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <path d="M9 13h6M9 17h4"/>
    </svg>
    PDF
  </button>

  <button
    
    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all duration-150 shadow-sm"
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <path d="M12 18v-6M9 15l3 3 3-3"/>
    </svg>
    Word
  </button>
</div>

        <button
          onClick={handleShare}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white border-none cursor-pointer transition-all duration-150 hover:-translate-y-0.5 ${
            shareCopied
              ? "bg-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
              : "bg-orange-600 hover:bg-orange-700 shadow-[0_2px_8px_rgba(234,88,12,0.25)] hover:shadow-[0_4px_12px_rgba(234,88,12,0.35)]"
          }`}
        >
          {shareCopied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share link
            </>
          )}
        </button>
      </div>

      {/* ── Presence ── */}
      <UserPanel users={users} />

      {/* ── Toolbar ── */}
      <Toolbar
        onBold={() => execFormat("bold")}
        onItalic={() => execFormat("italic")}
        onUnderline={() => execFormat("underline")}
        onHeading1={() => execBlock("header", 1)}
        onHeading2={() => execBlock("header", 2)}
        onUndo={() => execHistory("undo")}
        onRedo={() => execHistory("redo")}
        onAlignLeft={() => execBlock("align", false)}
        onAlignCenter={() => execBlock("align", "center")}
        onBullet={() => execBlock("list", "bullet")}
        activeFormats={activeFormats}
      />

      {/* ── Editor ── */}
      <TextEditor onReady={handleQuillReady} cursors={cursors} />
    </div>
  );
};

export default Document;