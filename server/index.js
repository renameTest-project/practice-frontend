const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
  cors : {
    origin : 'http://localhost:3000',
    methods : ['GET', 'POST']
  },
});

io.on("connection", (socket) => {
  console.log(`User connected : ${socket.id}`);

  socket.on("send-message", (message) => {
    console.log(message);
    // Broadcast the recevied message to all the connect
    io.emit("received-message", message);
  });

  socket.on("disconnect", () => console.log("User disconnected"));
})

server.listen(5000, () => console.log("setver running at port 5000"))