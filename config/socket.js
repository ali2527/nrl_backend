const socketIO = require("socket.io");

let io; // Declare io as a global variable

function initializeWebSocket(server) {
  io = socketIO(server, {
    pingTimeout: 60000,
    cors: true,
    origin: ["*"],
  });

  io.on(
    "connection",
    (socket) => {
      console.log("Connected to socket.io");
  
      socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("User Joined Room:", userData._id);
        socket.emit("connected");
      });

      socket.on("setupAdmin", (userData) => {
        socket.join("admin");
        console.log("Admin Joined Room");
        socket.emit("connected");
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected");
      });
    },
    []
  );
  
}

module.exports = {
  initializeWebSocket,
  getIO: () => io, // Export a function to get the io instance
};