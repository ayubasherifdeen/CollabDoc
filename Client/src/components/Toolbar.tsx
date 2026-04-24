import React from 'react'

type ToolbarProps = {
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onHeading1?: () => void;
  onHeading2?: () => void;
  onAlignLeft?: () => void;
  onAlignRight?: () => void;
  onAlignCenter?: () => void;
  onBullet?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  activeFormats?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
};

interface BtnProps {
  onClick?: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

const Divider = () => (
  <div className="w-px h-[22px] bg-stone-200 mx-1 flex-shrink-0" />
);

const Btn: React.FC<BtnProps> = ({ onClick, active, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`
      inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg border-none
      text-[13px] font-semibold cursor-pointer transition-all duration-100 flex-shrink-0
      ${active
        ? "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-300"
        : "bg-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-800 hover:-translate-y-px"
      }
    `}
  >
    {children}
  </button>
);


export const Toolbar:React.FC<ToolbarProps> = ({ onBold, onItalic, onUnderline,
  onHeading1, onHeading2,
  onAlignLeft, onAlignCenter, onBullet,
  onUndo, onRedo,
  activeFormats = {}, }) => {

  return (
    <div className="bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 flex items-center gap-0.5 flex-wrap shadow-sm mb-3">
 
      {/* Undo / Redo */}
      <Btn onClick={onUndo} title="Undo (Ctrl+Z)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" /><path d="M21 17A9 9 0 006 5.1L3 8" />
        </svg>
      </Btn>
      <Btn onClick={onRedo} title="Redo (Ctrl+Y)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0115-2.9L21 8" />
        </svg>
      </Btn>
 
      <Divider />
 
      {/* Format */}
      <Btn onClick={onBold} active={activeFormats.bold} title="Bold (Ctrl+B)">
        <span style={{ fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 14 }}>B</span>
      </Btn>
      <Btn onClick={onItalic} active={activeFormats.italic} title="Italic (Ctrl+I)">
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 14 }}>I</span>
      </Btn>
      <Btn onClick={onUnderline} active={activeFormats.underline} title="Underline (Ctrl+U)">
        <span className="underline text-[13px]">U</span>
      </Btn>
 
      <Divider />
 
      {/* Headings */}
      <Btn onClick={onHeading1} title="Heading 1">
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, letterSpacing: "-0.02em" }}>H1</span>
      </Btn>
      <Btn onClick={onHeading2} title="Heading 2">
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, letterSpacing: "-0.02em" }}>H2</span>
      </Btn>
 
      <Divider />
 
      {/* Alignment & list */}
      <Btn onClick={onAlignLeft} title="Align left">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="14" y2="12" /><line x1="3" y1="18" x2="17" y2="18" />
        </svg>
      </Btn>
      <Btn onClick={onAlignCenter} title="Center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </Btn>
      <Btn onClick={onBullet} title="Bullet list">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
          <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </Btn>
 
      {/* Live badge — pushed right */}
      <div className="ml-auto flex items-center gap-1.5 bg-orange-50 text-orange-600 text-[11px] font-semibold tracking-wide rounded-full px-3 py-1 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        Live
      </div>
    </div>
  
  );
}

export default Toolbar;
