const socketIo = require("socket.io");

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://react-order-nine.vercel.app",
        "https://dev-hotels.onrender.com",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  global._io = io;

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Handle video stream
    socket.on("video-stream", (data) => {
      socket.broadcast.emit("video-stream", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};
