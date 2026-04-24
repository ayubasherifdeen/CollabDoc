import React from "react";

type Props = {
  users: string[];
};

const COLORS = [
  { bg: "bg-orange-500",  hex: "#f97316" },
  { bg: "bg-blue-500",    hex: "#3b82f6" },
  { bg: "bg-emerald-500", hex: "#10b981" },
  { bg: "bg-violet-500",  hex: "#8b5cf6" },
  { bg: "bg-pink-500",    hex: "#ec4899" },
  { bg: "bg-amber-500",   hex: "#f59e0b" },
];
 
function getColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}
 
function getInitials(id: string) {
  return id.slice(0, 2).toUpperCase();
}
 

const UserPanel: React.FC<Props> = ({ users }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-4 flex-wrap mb-3">
 
      {/* Live indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest">
          {users.length} online
        </span>
      </div>
 
      <div className="w-px h-5 bg-stone-200 flex-shrink-0" />
 
      {/* Avatar stack */}
      {users.length === 0 ? (
        <span className="text-[13px] text-stone-400 italic">
          No other users yet — share the link!
        </span>
      ) : (
        <div className="flex items-center">
          {users.map((user, i) => {
            const color = getColor(user);
            return (
              <div
                key={user}
                title={user}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-white text-[11px] font-bold tracking-wide
                  border-2 border-white shadow-sm cursor-default
                  transition-transform duration-150 hover:scale-110 hover:-translate-y-0.5
                  ${color.bg}
                `}
                style={{
                  marginLeft: i === 0 ? 0 : -8,
                  zIndex: users.length - i,
                  position: "relative",
                }}
              >
                {getInitials(user)}
              </div>
            );
          })}
        </div>
      )}
 
      {users.length > 0 && (
        <>
          <div className="w-px h-5 bg-stone-200 flex-shrink-0" />
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {users.map((user) => {
              const color = getColor(user);
              return (
                <span key={user} className="flex items-center gap-1.5 text-[12px] text-stone-500">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.bg}`}
                  />
                  {user.length > 10 ? user.slice(0, 10) + "…" : user}
                </span>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPanel;