import React from "react";

type User = { id: string; name: string; color: string };

type Props = {
  users: User[];
};

const UserPanel: React.FC<Props> = ({ users }) => {
  if (users.length === 0) return null;

  return (
    <div className="bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-4 flex-wrap mb-3">

      {/* Live indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest">
          {users.length} {users.length === 1 ? "person" : "people"} online
        </span>
      </div>

      <div className="w-px h-5 bg-stone-200 flex-shrink-0" />

      {/* Avatar stack */}
      <div className="flex items-center">
        {users.map((user, i) => (
          <div
            key={user.id}
            title={user.name}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold border-2 border-white shadow-sm cursor-default transition-transform duration-150 hover:scale-110 hover:-translate-y-0.5"
            style={{
              background: user.color,
              marginLeft: i === 0 ? 0 : -8,
              zIndex: users.length - i,
              position: "relative",
            }}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>
        ))}
      </div>

      <div className="w-px h-5 bg-stone-200 flex-shrink-0" />

      {/* Name list */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {users.map((user) => (
          <span
            key={user.id}
            className="flex items-center gap-1.5 text-[12px] text-stone-500"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: user.color }}
            />
            {user.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserPanel;