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
var blueTeam = [];
var redTeam = [];
var blueScore = 0;
var redScore = 0;

var player = {x: "0", y: "0", id: "0"}


io.on("connection", function (socket) {
	// Socket stuff in here
	// Add new object to team arrays
	playerCt++;
	if (playerCt % 2 == 1) {
		redTeam.push{x: "0", y: '0', id: socket.id}
	}
	else {
		blueTeam.push{x: "0", y: '0', id: socket.id}
	}



	socket.on('disconnect', function() {
		console.log("User disconnected" + socket.id);
		playerCt--;
	})
});

server.listen(8080, function () {
	console.log("server running on port 8080");
});
