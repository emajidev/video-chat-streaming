
class P2p{ 
    static stream = null;
    
    static peer(){
        const peer = new Peer(undefined, {
            host: "/",
            port: "3001",
          });
          console.log("peer",peer)
        return peer
    }
    static _stream(){
        navigator.mediaDevices
        .getUserMedia({
            video: false,
            audio: true,
        })
        .then((stream) => {
            // when initializing web-cam show it in video
            P2p.stream = stream;
            // when answer the call is exists render the other user
        });
    }
}
