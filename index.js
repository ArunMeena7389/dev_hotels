const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let senderSocket = null;

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join", (role) => {
    if (role === "sender") senderSocket = socket;
    if (role === "receiver" && senderSocket) {
      senderSocket.emit("request-offer", socket.id);
    }
  });

  socket.on("offer", ({ offer, to }) => {
    io.to(to).emit("offer", { offer, from: socket.id });
  });

  socket.on("answer", ({ answer, to }) => {
    io.to(to).emit("answer", { answer });
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    io.to(to).emit("ice-candidate", { candidate });
  });

  socket.on("disconnect", () => {
    if (senderSocket === socket) senderSocket = null;
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
