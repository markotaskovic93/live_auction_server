const http = require("http")
const express = require("express")
const socketio = require("socket.io")

const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)

const io = socketio(server, {
  cors: {
    origin: "*",
  },
})

io.on("connect", (socket) => {
  console.log("someone connected")
  socket.emit("connected") //handle new connection

  socket.on("new_message", (messageData) => {
    console.log(messageData)
    io.emit("message", messageData)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

server.listen(PORT, () => console.log(`listening to port ${PORT}`))
