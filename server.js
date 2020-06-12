//----------------------------- Requirements --------------------------------------------
const express        = require("express");
const bodyParser     = require("body-parser");
// const passport       = require("passport");
// const mongoose       = require("mongoose");
const socketEvents   = require('./socketEvents');  
const routes         = require("./routes");
// const db             = require("./models");

//------------------------------- Express -----------------------------------------------
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("bsvq/build"));
app.use(require("express-session")(
  { 
    secret: 'qvsb', 
    resave: false, 
    saveUninitialized: false
  }
));

app.use(routes);

//----------------------------- Start Server --------------------------------------------
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, function(err) { 
  if (err) console.log(err); 
  else console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`); 
});

//------------------------------ Socket.io ----------------------------------------------
const io = require('socket.io').listen(server);
socketEvents(io)

// app.set('socketio', io);