//******************************************************************************//
//*********************************LOGIC EXPONENT*******************************//
//******************************************************************************//
'use strict';

const socket = io("/");
let conn;
let my_peer_id;
let peer_id;
let users = [];
let peerList = [];
let currentPeer;
// video chat
// PETICION DE PERMISOS PARA CAMARA Y MICROFONO
function getVideo(callbacks){
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  var constrains ={
    audio:true,
    video:true
  }
  navigator.getUserMedia(constrains,callbacks.success,callbacks.error)

}

getVideo({
  success:function(stream){
    window.localStream = stream;
    console.log("my video",stream)
    recStream(stream,"lVideo")
  },
  error:function(error){
    alert(error);
    console.log(error)
  }
})
//const videoGrid = document.getElementById("video-grid");
// SIMPLE  SERVER P2P FOR TX
const peer = P2p.peer()

peer.on("open",(id)=>{
  let dataUser = {name:"",id:peer.id};
  socket.emit("join-room", ROOM_ID, dataUser);
  $("#displayId").html(id)
})
peer.on("connection",(connection)=>{
  conn   = connection;
  peer_id= connection.peer
  console.log("connection",connection.peerConnection)
  //$("#connId").val(peer_id)
})
peer.on("error",(error)=>{
  console.log("error",error)
})

$("#start-share-scream").on("click",()=>{
  start_share_screen();
})
$("#stop-share-scream").on("click",()=>{
  stop_share_screen();
})
// RESPUESTA DEL INVITADO REMOTO
peer.on("call",function(call){
  var acceptsCall = confirm("Quieres aceptar la llamada?");
  if(acceptsCall){
    // Unirse a la sala 
    call.answer(window.localStream);
    call.on("stream",function(stream){
      window.peer_stream = stream;
      console.log("stream2",stream)
      currentPeer = call.peerConnection;
      console.log("currentPeer remote",currentPeer)

      recStream(stream,"rVideo")
    });
    call.on("close",function(){
      alert("llamada terminada")
    })
  }else{
    console.log("llamada denegada")
  }
})


//CHAT
$("#btn-send-msg").on("click",()=>{
  let msg = $("#msg-chat").val()
  socket.emit("send-msg",ROOM_ID,msg)
})
socket.on('res-msg', (msg) => {
  console.log("recibido",msg)
  $("#messages").append(`<li>${msg}</li>`)
})

$("#launcher").on("click",()=>{
  // Al publicar esto deberia ir a una bd para ser mostrada 
  let DATA_ROOM =[ {
    id_room : ROOM_ID,
    user:{}
  }]
  localStorage.setItem('BDStreaming', JSON.stringify(DATA_ROOM));
  // Envia señal para refrescar la lista de salas
  socket.emit("refresh-list-rooms","update")
})
// DETECTA SI HAY NUEVO USUARIOS CONECTADOS
// Luego se realiza una llamada al usuario  para que vizualice la videoconferencia
socket.on('user-connected', (dataUser,socket_id) => {
  console.log("usuario conectado", dataUser.id,socket_id)
  peer.connect(dataUser.id)
  call_peer_id(dataUser.id,window.peer_stream,"rVideo")
  //Genera un temlate para mostrar los usuarios conectados
  template_users_conn(dataUser);

  // Espera hasta que llegue la infomacion de usuario solcitante 
  setTimeout(()=>{
    let data = {
     creator:{ name:"TEST",peer_id:peer.id,type:"EXP_P"},
     guest:peerList
    }
    //Envia una respuesta de peticion con los datos del creador de la videoconferencia
    socket.emit("resp-conn",data,socket_id)
    
    //=======LLAMA AL ESPECTADOR=============//
    // Para mostrar al exponente local
    //call_peer_id(dataUser.id,window.localStream)
    // para mostrar al exponente remoto 
    //call_peer_id(dataUser.id,window.peer_stream,"rVideo")
  },500)
}) 

// VISTA DE VIDEOCONFERENCIA
function recStream(stream,elemId){
  var video = document.getElementById(elemId)
  video.srcObject    = stream;
  window.peer_stream = stream;
}
// TEMPLATE DE USUARIOS CONECTADOS
function template_users_conn(dataUser){
    users.push(dataUser);
    $("#users-connect").empty()
    users.forEach((item)=>{
      
      $("#users-connect").append(`
      <li class="list-group-item ">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#21d600" class="bi bi-circle-fill" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8"/>
      </svg>
      ${item.id}
      ${item.name}
      </li>`)

    })
}

// LLAMADA DE USUARIO PARA VIDEOCONFERENCIA
function call_peer_id(peer_id,localStream,elementId){
  console.log("llamando")
  var call = peer.call(peer_id,localStream)
  call.on("stream",(stream)=>{
    console.log("stream",stream)
    if(!peerList.includes(call.peer)){
      recStream(stream,elementId);
      window.peer_stream = stream;
      currentPeer = call.peerConnection; // <--- revisar esto
      console.log("currentPeer",currentPeer)
      peerList.push(call.peer);
      console.log("peerList",peerList)
    }
  })
}
//unirse a la sala 
function join_room(roomId,dataUser){
  socket.emit("join-room", roomId, dataUser);
}
// Iniciar compartir pantalla
function start_share_screen(){
  navigator.mediaDevices.getDisplayMedia({
    video:{cursor:"always"},
    audio:{
      echoCancellation:true,
      noiseSuppression:true
    }}).then((stream)=>{
        console.log(stream)
        console.log("stream screen",stream)
        console.log("currentPeer screen",currentPeer)

        //Mostrar share scream en local
        recStream(stream,"lVideo")
        //Mostrar share scream en pares conectados
        console.log("stream.getVideoTracks()",stream.getVideoTracks())
        let videoTrack = stream.getVideoTracks()[0];
        let sender = currentPeer.getSenders().find((s)=>{
          return s.track.kind == videoTrack.kind
        })
        sender.replaceTrack(videoTrack)
    }).catch((e)=>{
      console.log(e)
    })
}
// Detener compartir pantalla
function stop_share_screen(){
  const videoTrack = window.localStream.getVideoTracks()[0];

  // Cambiar compartir pantalla a camara 

  //local
  recStream( window.localStream,"lVideo")

  //remoto
  let sender = currentPeer.getSenders().find((s)=>{
    return s.track.kind == videoTrack.kind;
  })
  sender.replaceTrack(videoTrack)
}