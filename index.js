const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const port = process.env.PORT || 8000;

let userData = [];

io.on("connection", (socket) => {
  socket.emit("your id", socket.id);
  socket.on("join room", (room) => {
    console.log(`${socket.id} joined room ${room}.`);
    socket.join(room);
  });
  socket.on("leave room", (room) => {
    // console.log(`${socket.id} left room ${room.roomID}.`);
    // let i;
    // for (i = 0; i < userData.length; i++) {
    //   if (userData[i].id == socket.id) {
    //     userData.splice(i, 1);
    //   }
    // }
    socket.leave(room);
    // io.to(info.room).emit("refresh attendees", userData);
  });
  socket.on("send message", (body) => {
    io.to(body.room).emit("message", body);
    console.log(socket.id, body, body.room);
  });
  socket.on("store user", (info) => {
    // console.log(username, socket.id)
    userData.push({ name: info.name, id: socket.id, room: info.room });
    console.log(userData);
    io.to(info.room).emit("refresh attendees", userData);
  });
  // socket.on("remove user", id => {

  // })
});

app.get("/", (req, res) => {
  res.send("Server has successfully started.");
});

server.listen(port, () => console.log("server is running on port " + port));
