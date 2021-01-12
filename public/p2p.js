// INIcIALIZACION DE SERVIDOR P"P
class P2p{ 
    static stream = null;
    
    static peer(){
        // configuracion 
        let config = {
            host: "/",
            port: "3001",
          }
        //Inicializacion de nuevo serviio Peer
        const peer = new Peer(undefined, config);
        return peer
    }
    // Optien permiso para el uso de la camara y el microfono
    static _stream(){
        navigator.mediaDevices
        .getUserMedia({
            video: false,
            audio: true,
        })
        .then((stream) => {
            P2p.stream = stream;
        });
    }
}
