
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------

exports = module.exports = function(io) {  
  io.on('connection', (socket) => {  // Set socket.io listeners ------------------------
  
//----------------------------------- slideChange --------------------------------------   
//data: data.id is project id, data.sidePos is the slide number
socket.on('slideChange', function(data){ 
  socket.broadcast.emit(data.id, data.slidePos)
});

//--------------------------------------------------------------------------------------
  })
}