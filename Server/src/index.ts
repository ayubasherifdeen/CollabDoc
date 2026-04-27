import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "documents.json");

// Load from disk on startup
const documents: Record<string, any> = fs.existsSync(DATA_FILE)
  ? JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
  : {};

// Debounced write — waits 2s after last change before hitting disk
const saveTimers: Record<string, ReturnType<typeof setTimeout>> = {};

function persistDocument(docId: string) {
  if (saveTimers[docId]) clearTimeout(saveTimers[docId]);
  saveTimers[docId] = setTimeout(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(documents, null, 2));
    console.log(`Saved: ${docId}`);
  }, 2000);
}
const documentUsers: Record<string, Set<string>> = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  //Join
  socket.on("join-document", (docId: string) => {
    socket.join(docId);
    socket.data.docId = docId;

    if (!documents[docId]) documents[docId] = { ops: [] };
    if (!documentUsers[docId]) documentUsers[docId] = new Set();

    documentUsers[docId].add(socket.id);

    socket.emit("load-document", documents[docId]);
    io.to(docId).emit("users-update", [...documentUsers[docId]]);
  });

  // ── Text change — one listener per socket, not per join
  socket.on("text-change", ({ delta, contents }: { delta: any; contents: any }) => {
    const docId = socket.data.docId;
    if (!docId) return;
    documents[docId] = contents;
    socket.to(docId).emit("receive-changes", delta);
    persistDocument(docId);
  });

  // ── Cursor — same 
  socket.on("cursor-move", (data: { position: number; color: string; name: string }) => {
    const docId = socket.data.docId;
    if (!docId) return;
    socket.to(docId).emit("receive-cursor", { id: socket.id, ...data });
  });

  // ── Disconnect
  socket.on("disconnect", () => {
    const docId = socket.data.docId;
    if (docId && documentUsers[docId]) {
      documentUsers[docId].delete(socket.id);
      io.to(docId).emit("users-update", [...documentUsers[docId]]);
      if (documentUsers[docId].size === 0) delete documentUsers[docId];
    }
    console.log("Disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Server running on http://localhost:4000"));