
const socket = io("/");

socket.on("update-list-rooms",(msg)=>{
    console.log("LIST ROOMS",msg);
    get_data_room();
    
    
})
// Aqui deberia obtener los datos de la bd para interarlas y luego mostrar los posters
function get_data_room(){
    let data_room = JSON.parse(localStorage.getItem('BDStreaming'));
    console.log(data_room);
    data_room.forEach((element,index )=> {
        $("#list-conference").append(template());
        $("#join").on("click",()=>{
            $("#list-conferences").hide()
            $("#Viewer-conference").show()

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
                <button id="join" type="button" class="btn btn-danger">
                    <div class="row m-1">
                        <h6 class="m-1">EN VIVO</h6>
                        <div class="icon-live parpadea m-1"></div>
                    </div>
                </button>
        </div>
    </div>
    `
}
