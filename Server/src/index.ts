import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ── Persistence ───────────────────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, "documents.json");

const documents: Record<string, any> = fs.existsSync(DATA_FILE)
  ? JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
  : {};

const saveTimers: Record<string, ReturnType<typeof setTimeout>> = {};

function persistDocument(docId: string) {
  if (saveTimers[docId]) clearTimeout(saveTimers[docId]);
  saveTimers[docId] = setTimeout(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(documents, null, 2));
    console.log(`Saved: ${docId}`);
  }, 2000);
}

// ── User tracking — stores full identity per socket ───────────────────────────
// { docId -> Map<socketId, { name, color }> }
const documentUsers: Record<string, Map<string, { name: string; color: string }>> = {};

function getUserList(docId: string) {
  const map = documentUsers[docId];
  if (!map) return [];
  return [...map.entries()].map(([id, info]) => ({ id, ...info }));
}

// ── Socket ────────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join-document", ({ docId, name, color }: { docId: string; name: string; color: string }) => {
    socket.join(docId);
    socket.data.docId = docId;

    // Init document if new
    if (!documents[docId]) documents[docId] = { ops: [] };

    // Init user map for this doc if new
    if (!documentUsers[docId]) documentUsers[docId] = new Map();

    // Register this user with their real name and color
    documentUsers[docId].set(socket.id, { name, color });

    // Send current document to joining user
    socket.emit("load-document", documents[docId]);

    // Broadcast updated user list to everyone in the room
    io.to(docId).emit("users-update", getUserList(docId));
  });

  socket.on("text-change", ({ delta, contents }: { delta: any; contents: any }) => {
    const docId = socket.data.docId;
    if (!docId) return;
    documents[docId] = contents;
    socket.to(docId).emit("receive-changes", delta);
    persistDocument(docId);
  });

  socket.on("cursor-move", (data: { position: number; color: string; name: string }) => {
    const docId = socket.data.docId;
    if (!docId) return;
    socket.to(docId).emit("receive-cursor", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    const docId = socket.data.docId;
    if (docId && documentUsers[docId]) {
      documentUsers[docId].delete(socket.id);

      // Tell other clients to remove this user's cursor
      socket.to(docId).emit("user-left", socket.id);

      // Broadcast updated user list
      io.to(docId).emit("users-update", getUserList(docId));

      if (documentUsers[docId].size === 0) delete documentUsers[docId];
    }
    console.log("Disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Server running on http://localhost:4000"));