const express = require('express')
const path = require('path')
const socketio =  require('socket.io')
const http = require('http')

const SERVER_PORT = process.env.PORT || 3333

const app = express();
const server = http.createServer(app)
const io = socketio(server)

let usersockets = {}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(SERVER_PORT, () => console.log('Website started on http://localhost:3333'));

app.get("/", (req, res) => {
    res.send("marko je pajser");
});

//app.use('/', express.static(path.join(__dirname, 'src')));

io.on('connection', (socket) => {
    console.log("New Socket formed from " + socket.id);
    socket.emit('connected', {
        marko: "Napusis mi se sa kurac"
    })
    socket.on('login', (data) => {
        //username is in data.user
        usersockets[data.user] = socket.id
        console.log(usersockets)
    })
    // listener on the socket
    socket.on('send_msg', (data) => {
        //socket.broadcast only other will get it
        if (data.message.startsWith('@')) {
            let recipient = data.message.split(':')[0].substr(1)
            let rcpSocket = usersockets[recipient]
            io.to(rcpSocket).emit('recv_msg', data)
        } else {
            socket.broadcast.emit('recv_msg', data)   //io.emit means every socket which is connected will get the msg
        }
        socket.emit('sad', "sve li ti jebem");
    })
})






