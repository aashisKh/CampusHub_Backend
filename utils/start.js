import { Server } from "socket.io";

export function socketConnection(server) {
  console.log("function called");
  const io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  // console.log(io);
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log("user with id:", socket.id, "connected in a room:", data);
    });

    socket.on("send_message", (data) => {
      console.log(data);
      socket.to(data.subject).emit("recieve_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
}
