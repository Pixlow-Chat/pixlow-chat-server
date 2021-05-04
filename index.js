const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const port = process.env.PORT || 8000;

let userData_A = [];
let userData_B = [];
let userData_C = [];
let userData_D = [];

io.on("connection", (socket) => {
  // socket.emit("your id", socket.id);
  socket.on("join room", (room) => {
    console.log(`${socket.id} joined room ${room}.`);
    socket.join(room);
    socket.emit("your id", socket.id);
    // console.log(socket.id)
  });
  socket.on("leave room", (room) => {
    console.log(room)
    if(room.roomID == 'A'){
      let i;
      for (i=0; i < userData_A.length; i++) {
        if(userData_A[i].id == socket.id){
          userData_A.splice(i, 1)
          io.to(room.roomID).emit("refresh attendees", userData_A)
        }
      }
    } else if(room.roomID == 'B'){
      let i;
      for (i=0; i < userData_B.length; i++) {
        if(userData_B[i].id == socket.id){
          userData_B.splice(i, 1)
          io.to(room.roomID).emit("refresh attendees", userData_B)
        }
      }
    } else if(room.roomID == 'C'){
      let i;
      for (i=0; i < userData_C.length; i++) {
        if(userData_C[i].id == socket.id){
          userData_C.splice(i, 1)
          io.to(room.roomID).emit("refresh attendees", userData_C)
        }
      }
    } else if(room.roomID == 'D'){
      let i;
      for (i=0; i < userData_D.length; i++) {
        if(userData_D[i].id == socket.id){
          userData_D.splice(i, 1)
          io.to(room.roomID).emit("refresh attendees", userData_D)
        }
      }
    }
    // console.log(userData_A)
    socket.leave(room.roomID);
    // io.to(info.room).emit("refresh attendees", userData);
  });
  socket.on("send message", (body) => {
    io.to(body.room).emit("message", body);
    console.log(socket.id, body, body.room);
  });
  socket.on("store user", (info) => {
    // console.log(username, socket.id)
    if(info.room == 'A'){
      userData_A.push({ name: info.name, id: socket.id, room: info.room, icon: info.icon});
      io.to(info.room).emit("refresh attendees", userData_A)
    } else if(info.room == 'B'){
      userData_B.push({ name: info.name, id: socket.id, room: info.room, icon: info.icon});
      io.to(info.room).emit("refresh attendees", userData_B)
    } else if(info.room == 'C'){
      userData_C.push({ name: info.name, id: socket.id, room: info.room, icon: info.icon});
      io.to(info.room).emit("refresh attendees", userData_C)
    } else if(info.room == 'D'){
      userData_D.push({ name: info.name, id: socket.id, room: info.room, icon: info.icon});
      io.to(info.room).emit("refresh attendees", userData_D)
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server has successfully started.");
});

server.listen(port, () => console.log("server is running on port " + port));
