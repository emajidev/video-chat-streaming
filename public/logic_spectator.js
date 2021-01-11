//******************************************************************************//
//*********************************LOGIC SPECTATOR******************************//
//******************************************************************************//
const socket = io("/");
let conn;
let resp_room;
let yourPeerId;
let peerList = []
window.ROOM_ID ="";
//****************************************//
//**********VIDEO CONFERENCIA*************//
//****************************************//
// video chat
const peer = P2p.peer();
//CHAT
$("#btn-send-msg").on("click",()=>{
    let msg = $("#msg-chat").val()
    socket.emit("send-msg",window.ROOM_ID,msg)
  })
socket.on('res-msg', (msg) => {
console.log("recibido",msg)
$("#messages").append(`<li>${msg}</li>`)
}) 

peer.on("open",(id)=>{
  yourPeerId= id;
  $("#displayId").html(yourPeerId)
})
peer.on("call",function(call){
    console.log("llamada",call)
    call.answer();
    call.on("stream",function(stream){
        if(!peerList.includes(call.peer)){
            peerList.push(call.peer);
            console.log("peerList",peerList)
            recStream(stream,"rVideo");

        }
        call.on("close",function(){
            //alert("llamada terminada")
        })
   
    })

})

/* $("#conn_button").on("click",()=>{
    console.log("conectando")
    let roomId   = $("#connId").val()
    let name     = $("#name_user").val()
    let dataUser = {name,id:yourPeerId}
    socket.emit("join-room", roomId, dataUser);
  
    socket.on("resp-conference",(resp) => {
        console.log("resp conference",resp)
          

    })
}) */
function connection_room(id_room){
    let roomId   = id_room;
    let name     = $("#name_user").val();
    let dataUser = {name,id:yourPeerId};
    console.log("conectando",dataUser)

    socket.emit("join-room", roomId, dataUser);
  
    socket.on("resp-conference",(resp) => {
        console.log("resp conference",resp);
    })
}
function recStream(stream,elemId){
    var video   = document.createElement("video")
    let content = document.getElementById("container-video")
    video.classList.add("col-6")
    video.srcObject = stream;
    video.autoplay = true;
    console.log("video",video)
    content.append(video)
}


//****************************************//
//*****GENERAR POSTER DE CONFERENCIA*****//
//****************************************//
//ejecutar cuando se carga la pagina, verifica si hay elementos en la bd y luego renderiza
$(function() {    
    get_data_room();
});
socket.on("update-list-rooms",(msg)=>{
    console.log("LIST ROOMS",msg);
    get_data_room();
})
// Aqui deberia obtener los datos de la bd para interarlas y luego mostrar los posters
function get_data_room(){
    let data_room = JSON.parse(localStorage.getItem('BDStreaming'));
    console.log(data_room);
    data_room.forEach((element,index )=> {
        let template = `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="/img/streaming.jpg" alt="..." />
            <div class="card-body">
                <h5 class="card-title">Covid </h5>
                <h6 class="card-subtitle mb-2 text-muted">Por: Dr.Jose Luis</h6>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </p>
                    <button id="join" type="button" class="btn-join btn btn-danger">
                        <div class="row m-1">
                            <h6 class="m-1">EN VIVO</h6>
                            <div class="icon-live parpadea m-1"></div>
                        </div>
                    </button>
            </div>
        </div>
        `

        $("#list-conference").append(template);
        $(".btn-join").on("click",()=>{
            //cambia vista 
            $("#list-conferences").hide()
            $("#Viewer-conference").show()
            // variable global id de sala
            window.ROOM_ID = element.id_room;
            // conecta con sala
            connection_room(element.id_room)


        })
    });
}
function template(){
    let link = 1;
    return  template = `
    <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="/img/streaming.jpg" alt="..." />
        <div class="card-body">
            <h5 class="card-title">Covid </h5>
            <h6 class="card-subtitle mb-2 text-muted">Por: Dr.Jose Luis</h6>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </p>
                <button id="join" type="button" class="btn-join btn btn-danger">
                    <div class="row m-1">
                        <h6 class="m-1">EN VIVO</h6>
                        <div class="icon-live parpadea m-1"></div>
                    </div>
                </button>
        </div>
    </div>
    `
}