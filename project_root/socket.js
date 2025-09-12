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
    // Handle video stream
    socket.on("video-stream", (data) => {
      socket.broadcast.emit("video-stream", data);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};
