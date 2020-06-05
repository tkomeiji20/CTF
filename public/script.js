// FOR LUKE AND TREVOR -- START
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});






// // FOR LUKE AND TREVOR -- END

// Just for testing positioning things.

var testPlayer = {x: 20, y: 40}
//$("#test").css({"top":testPlayer.x, "left":testPlayer.x})
