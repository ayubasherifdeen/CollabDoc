import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const documents: Record<string, any> = {};
const documentUsers: Record<string, Set<string>> = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join-document", (docId: string) => {
    socket.join(docId);
    socket.data.docId = docId;

    if (!documents[docId]) documents[docId] = { ops: [] };
    if (!documentUsers[docId]) documentUsers[docId] = new Set();

    documentUsers[docId].add(socket.id);

    socket.emit("load-document", documents[docId]);
    io.to(docId).emit("users-update", [...documentUsers[docId]]);

    socket.on("text-change", ({ delta, contents }: { delta: any; contents: any }) => {
      documents[docId] = contents; // store full snapshot
      socket.to(docId).emit("receive-changes", delta); // broadcast diff
    });

    socket.on("cursor-move", (data: { position: number; color: string; name: string }) => {
      socket.to(docId).emit("receive-cursor", { id: socket.id, ...data });
    });
  });

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