# video-chat-streaming

## Ejecución de ejemplo.

    clona el repositorio  luego ejecuta`npm install, por ultimo `npm start y  peerjs --port 3001

### Estructura de funcionamiento
Web Real-Time Communication (WebRTC), o “comunicación en tiempo real mediante web. Esto estaconstruido bajo unos protocolos que permiten la comunicacion entre los pares conectados.

lnk:https://developer.mozilla.org/es/docs/Web/API/WebRTC_API/Protocols

una vez que se tiene en cuenta el funcionamiento de estos protocolos es importante establecer una arquitetura de comunicacion por lo que para el caso se de este proyecto se elijio una red P2P. En la siguente figura se muestra dicha arquitetura.


Para la creacion de nuestra red peer to peer se utilizo la libreria PeerJs, la cual permite crear la comunicacion entre pares de forma sencilla pormedio de coneciones y llamadas.
Link: https://peerjs.com

##### VIDEO-AUDIO.

Como se observa el par A realiza una llamada al invitado par B posteriormente al recibir la llamada el par B enviara una respuesta al par A por lo que de esta forma de establece una conmunicacion full duplex entre los pares. Al realizar la publicacion de la sala los nuevos abonados son detectados por comunicacion via socket la cual al recibir la respuesta permite realizar las llamadas.
En dado ejemplo la coneccion del abonado C se detecta en la sala por lo que A y B  son los que envian la llamada al abonado para que se integre a la sala pero la respuesta el abonado es vacia ya que este no transmite video y solo aptua como espertador.

![sample1](https://github.com/emajidev/video-chat-streaming/blob/main/p2p.jpeg?raw=true)

##### CHAT .

Luego para la arquitetura del chat se trata de una arquitectura de estrella donde el servidor orquesta las comunicaciones como mediador al recibir un mensaje y luego realizar un broadcast multidifucion a todos los pares conectados dentro de la red de la sala.

![sample2](https://github.com/emajidev/video-chat-streaming/blob/main/star.jpeg?raw=true)



