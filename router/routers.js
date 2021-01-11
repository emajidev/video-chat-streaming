const express = require("express");
const app = express()
const router = express.Router();
const { v4: uuidV4 } = require('uuid')
let bodyParser = require("body-parser");
app.get('*', function(req, res){
    res.status(404).send('what???');
  });
app.use("/",router)
app.use(function(req, res) {
    res.status(404).end('error');
});
// menu de opciones
router.get("/", (req, res) => {
    res.render("main");
   
});
router.get("/main", (req, res) => {
    res.render("main");
});
router.get("/public_room/", (req, res) => {
    console.log("req.id_room ",req.params.roomId )
    //res.send("hola",req.params.roomId);
    res.render("public_room", { roomId: req.params.id_room });

}); 

// unirse a sala
router.get("/join",(req, res) => {
    res.render("join");
});

// crear a sala
router.get("/create", (req, res) => {
    res.render("create");
});

// sala
router.get("/myroom", (req, res) => {
    res.redirect(`/${uuidV4()}`)
}); 

router.get("/:room", (req, res) => {
    res.render("room", { roomId: JSON.stringify(req.params.room) });
}); 


module.exports = router;
