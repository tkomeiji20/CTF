const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const pathPublic = path.join(__dirname, "/public");

var app = express();
let server = http.createServer(app);
let io = socketio(server);

app.use(express.static(pathPublic));

var playerCt = 0;
var players = [];
var blueScore = 0;
var redScore = 0;

io.on("connection", function (socket) {
	// Socket stuff in here
	// Add new object to team arrays
	playerCt++;
	if (playerCt % 2 == 1) {
		players.push({ x: "0", y: "0", id: socket.id });
	} else {
		players.push({ x: "0", y: "0", id: socket.id });
	}

	socket.on('up', function(){
		console.log("Moved up");
	})



	socket.on("disconnect", function () {
		console.log("User disconnected: " + socket.id);
		// Get index of person that left
		var toRemove = players
			.map(function (player) {
				return player.id;
			})
			.indexOf(socket.id);
		// Remove player from players
		if (toRemove != -1) {
			players.splice(toRemove, 1);
		} else {
			console.log("WHAT JUST HAPPENED?!");
		}

		playerCt--;
	});
});

server.listen(8080, function () {
	console.log("server running on port 8080");
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
