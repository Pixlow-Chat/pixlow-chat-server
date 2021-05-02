const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const port = process.env.PORT || 8000;

io.on("connection", socket => {
    socket.on("join room", room => {
      console.log(`${socket.id} joined room ${room}.`)
      socket.join(room)
    })
    socket.on("leave room", room => {
      console.log(`${socket.id} left room ${room.roomID}.`)
      socket.leave(room)
    })
    socket.emit("your id", socket.id);
    socket.on("send message", body => {
        io.to(body.room).emit("message", body)
        console.log(socket.id, body, body.room)
    })
})

app.get("/", (req, res) => {
  res.send("Server has successfully started.");
});


server.listen(port, () => console.log("server is running on port " + port));