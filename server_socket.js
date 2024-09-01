import { Server } from "socket.io";

const initilize_socket = (server) => {
    const io = new Server(server, {
        cors: {
          origin: "http://127.0.0.1:5173/teacher/dashboard",
          methods: ["GET", "POST"],
          credentials: true,
        },
      });

      io.on("connection", (socket) => {

        console.log("User connected", socket.id);
      
        socket.on("join_room", (data) => {
          console.log("joined to room" , data)
          socket.join(data);
          console.log("user with id:", socket.id, "connected in a room:", data);
        });
      
        socket.on("send_message", (data) => {
      
          // received_message_data.message = data.message
          console.log("the data is ",data);
          // console.log("the message to send is ", received_message_data)
          socket.to(data.subjectName).emit("receive_message", data);
          // socket.broadcast.emit("new_message", data);
       
      
        })

        socket.on("typing" , (data)=>{
          console.log("user typing" , data)
          socket.to(data.subject).emit("user_typing" , data)
          // socket.broadcast.emit("user_typing", data);
        })
        socket.on("message_sent" , (data) => {
          socket.to(data.subject).emit("user_sent_message", data);

        })
        socket.on("disconnect", () => {
          console.log("User disconnected", socket.id);
        });
      })
      
}

export default initilize_socket;