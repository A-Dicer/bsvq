
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
let projects = {}
exports = module.exports = function(io) {  
  io.on('connection', (socket) => {  // Set socket.io listeners ------------------------
  
//----------------------------------- slideChange --------------------------------------   
//data: data.id is project id, data.sidePos is the slide number
  socket.on('slideChange', function(data){ 
    projects[data.id] 
      ? projects[data.id].pos = data.slidePos
      : projects[data.id] = {pos: data.slidePos}
    
    socket.broadcast.emit(data.id, projects[data.id].pos)
  });

//------------------------------------- posCheck ---------------------------------------   
  socket.on('posCheck', function(data){ 
    socket.emit(
      `${data.id}check`, 
      projects[data.id] ? projects[data.id].pos : 0
    )
  });

//--------------------------------------------------------------------------------------
  })
}