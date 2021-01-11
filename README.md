# video-chat-streaming

# Ejecución de ejemplo.

    clona el repositorio  luego ejecuta`npm install` y por ultimo `npm run deploy`

# Estructura de funcionamiento
Web Real-Time Communication (WebRTC), o “comunicación en tiempo real mediante web. Esto estaconstruido bajo unos protocolos que permiten la comunicacion entre los pares conectados.

lnk:https://developer.mozilla.org/es/docs/Web/API/WebRTC_API/Protocols

una vez que se tiene en cuenta el funcionamiento de estos protocolos es importante establecer una arquitetura de comunicacion por lo que para el caso se de este proyecto se elijio una red P2P. En la siguente figura se muestra dicha arquitetura.
![sample1](https://raw.githubusercontent.com/emajidev/guide-api-facebook-nodejs/master/sample1.png)

Para la creacion de nuestra red peer to peer se utilizo la libreria PeerJs, la cual permite crear la comunicacion entre pares de forma sencilla pormedio de coneciones y llamadas.
Link: https://peerjs.com

#####VIDEO-AUDIO.

Como se observa el par A realiza una llamada al invitado par B posteriormente al recibir la llamada el par B enviara una respuesta al par A por lo que de esta forma de establece una conmunicacion full duplex entre los pares. Al realizar la publicacion de la sala los nuevos abonados son detectados por comunicacion via socket la cual al recibir la respuesta permite realizar las llamadas.
En dado ejemplo la coneccion del abonado C se detecta en la sala por lo que A y B  son los que envian la llamada al abonado para que se integre a la sala pero la respuesta el abonado es vacia ya que este no transmite video y solo aptua como espertador.

#####CHAT .

Luego para la arquitetura del chat se trata de una arquitectura de estrella donde el servidor orquesta las comunicaciones como mediador al recibir un mensaje y luego realizar un broadcast multidifucion a todos los pares conectados dentro de la red de la sala.
## 1.Configuración de servidor 

## 2.Configuración de servidor P2P 

## 3. Logica de creador de la sala

## 4.Logica del espectador

Primero comenzaremos con la creación de una cuenta en facebook developer. Una vez realizado esto crearás una nueva app.
