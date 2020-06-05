const debug = !process.env.NODE_ENV;
console.log("Environment: ", process.env.NODE_ENV || "dev");
console.log("Debugging: ", debug);

const express = require("express"),
	app = express(),
	server = app.listen(process.env.PORT || process.argv[2] || 8080, () => {
		debug && console.log(server.address());
	}),
	helmet = require("helmet"),
	io = require("socket.io")(server);

app.use(helmet());
app.use(express.static(__dirname + "/public"));

var playerCt = 0;
var players = [];
var blueScore = 0;
var redScore = 0;

io.on("connection", function (socket) {
	// Socket stuff in here
	// Add new object to team arrays
	debug && console.log("Player connected!");
	
	socket.emit('newPlayer', socket.id);

	playerCt++;
	if (playerCt % 2 == 1) {
		players.push({ team: "red", x: 0, y: 0, id: socket.id });
	} else {
		players.push({ team: "blue", x: 0, y: 0, id: socket.id });
	}

	socket.on("up", function () {
		debug && console.log("Moved up");
		players.find((player) => player.id === socket.id).y++;
	});

	socket.on("down", function () {
		debug && console.log("Moved down");
		players.find((player) => player.id === socket.id).y--;
	});

	socket.on("left", function () {
		debug && console.log("Moved left");
		players.find((player) => player.id === socket.id).x++;
	});

	socket.on("right", function () {
		debug && console.log("Moved right");
		players.find((player) => player.id === socket.id).x--;
	});

	socket.on("disconnect", function () {
		debug && console.log("User disconnected: " + socket.id);
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
			debug && console.log("WHAT JUST HAPPENED?!");
		}

		playerCt--;
	});
});

setInterval(function () {
	io.sockets.emit("refresh", players);
}, 3000);

// io.on("connection", (socket) => {
// 	socket.on("chat message", (msg) => {
// 		console.log("message: " + msg);
// 	});
// });

// io.on("connection", (socket) => {
// 	socket.on("chat message", (msg) => {
// 		io.emit("chat message", msg);
// 	});
// });
