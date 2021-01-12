const express = require('express')
const app = express()
const path = require('path');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'));
app.locals.basedir = path.join(__dirname, 'views');

app.use("/jquery", express.static(path.join(__dirname, '/node_modules/jquery/dist')))
app.use("/bootstrap", express.static(path.join(__dirname, '/node_modules/bootstrap/dist')))

app.use('/',require('./router/routers'))


io.on('connection', socket => {
  //console.log("identificador",socket.id)
    // Conexión a sala de video conferencia
    socket.on('join-room', (roomId, dataUser) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', dataUser, socket.id)
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', dataUser)
      })
    })
    //Respuesta de conexión
    socket.on("resp-conn",(data,socket_id)=>{
      console.log("resp-conn",data)
      io.sockets.to(socket_id).emit("resp-conference",data)
    })
    // chat 
    socket.on("send-msg",(roomId,msg)=>{
      console.log("send-msg",roomId,msg)
      io.sockets.to(roomId).emit('res-msg', msg)
    })
    //Refresh list rooms
    socket.on("refresh-list-rooms",(msg)=>{
      console.log("refresh?",msg)
      io.sockets.emit('update-list-rooms', "update")
    })
    
})
server.listen(3000)