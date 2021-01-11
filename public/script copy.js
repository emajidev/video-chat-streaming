const socket = io("/");

const videoGrid = document.getElementById("video-grid");
// SIMPLE  SERVER P2P FOR TX
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
let peer_id;
let conn;
// Get permissions web-cam
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    // when initializing web-cam show it in video
    window.stream = stream;
    addVideoStream(myVideo, stream);

    // when answer the call is exists render the other user
  });
// Once the initialization succeeds:
// Show the ID that allows other user to connect to your session.
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
  $("#myId").html(id);
});
// When someone connects to your session:
//
// 1. Hide the peer_id field of the connection form and set automatically its value
// as the peer of the user that requested the connection.
// 2. Update global variables with received values

myPeer.on("connection", (connection) => {
  console.log("connection", connection);
  conn = connection;
  peer_id = connection.peer;

  // Use the handleMessage to callback when a message comes in
  conn.on("data", (handleMessage)=>{
    console.log("msg:",handleMessage)
  });

  // Hide peer_id field and set the incoming peer id as value
  $("#invited").hide();
  $("#invited").val(peer_id)
  window.peer_id = peer_id
  $("#connected_peer").html("solicitud entrante",peer_id);
  alert("solicitud de conexion")

});

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on("error", (e) => {
  console.log("ERROR", e);
});

// Handle the on receive call event

myPeer.on("call", (call) => {
  let acceptsCall = confirm("Aceptar llamada entrante");

  if (acceptsCall) {
    // Answer the call with your own video/audio stream
    call.answer(window.localStream);

    // Receive data
    call.on("stream", function (stream) {
      // Store a global reference of the other user stream
      window.peer_stream = stream;
      // Display the stream of the other user in the peer-camera video element !

      
    });

    // Handle when the call finishes
    call.on("close", function () {
      alert("The videocall has finished");
    });

    // use call.close() to finish a call
  } else {
    console.log("Call denied !");
  }
  /*  call.answer(stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    console.log("userVideoStream",userVideoStream)
    addVideoStream(video, userVideoStream)
  }) */
});
async function connect(anotherId) {
  try {
    const conn = await myPeer.connect(anotherId);

    const resp = await conn.on("open", function () {
      console.log("cox", conn);
      conn.send("Invitacion enviada");
      alert("Invitacion enviada a:"+anotherId)
      
    });
    setTimeout(() => {
      if (!resp.open) {
        console.log("ERROR");
      }
    }, 100);
  } catch (e) {
    console.log("ERROR", e);
  }
}

/* 
socket.on('user-connected', userId => {
  connectToNewUser(userId, stream)
}) */
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
  console.log("new user", userId);
  connect(userId);
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
function invited() {
  $("#btn-invited").click(async () => {
    let invitedID = $("#invited").val();
    try {
      await connect(invitedID);
    } catch (e) {
      console.log("ERROR CONNECTION", e);
    }
  });
}
invited();

function handleMessage(data) {
  var orientation = "text-left";

  // If the message is yours, set text to right !
  if(data.from == username){
      orientation = "text-right"
  }

  var messageHTML =  '<a href="javascript:void(0);" class="list-group-item' + orientation + '">';
          messageHTML += '<h4 class="list-group-item-heading">'+ data.from +'</h4>';
          messageHTML += '<p class="list-group-item-text">'+ data.text +'</p>';
      messageHTML += '</a>';

  document.getElementById("messages").innerHTML += messageHTML;
}