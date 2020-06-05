<<<<<<< Updated upstream
=======
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const pathPublic = path.join(__dirname, '/public');

var app = express();
let server = http.createServer(app);
let io = socketio(server);

app.use(express.static(pathPublic));

io.on('connection', function(socket) {


});


server.listen(8080, function() {
	console.log("server running on port 8080");
});
>>>>>>> Stashed changes
