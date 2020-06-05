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

let playerCt = 0,
	players = [],
	blueScore = 0,
	redScore = 0,
	moveSpeed = 10;

io.on("connection", function (socket) {
	// Socket stuff in here
	// Add new object to team arrays
	debug && console.log("Player connected!");

	playerCt++;
	if (playerCt % 2 == 1) {
		players.push({
			team: "red",
			x: 50,
			y: 576 / 2,
			id: socket.id,
			hasFlag: false,
		});
		socket.emit("newPlayer", socket.id, "red");
	} else {
		players.push({
			team: "blue",
			x: 876 - 50,
			y: 576 / 2,
			id: socket.id,
			hasFlag: false,
		});
		socket.emit("newPlayer", socket.id, "blue");
	}

	socket.on("up", function () {
		debug && console.log("Moved up");
		players.find((player) => player.id === socket.id).y += moveSpeed;
	});

	socket.on("down", function () {
		debug && console.log("Moved down");
		players.find((player) => player.id === socket.id).y -= moveSpeed;
	});

	socket.on("left", function () {
		debug && console.log("Moved left");
		let player = players.find((player) => player.id === socket.id);
		player.x -= moveSpeed;

		// 438 is the midpoint
		if (player.x < 438 && player.team === "blue" && player.hasFlag) {
			redScore++;
			player.hasFlag = false;
		}
	});

	socket.on("right", function () {
		debug && console.log("Moved right");
		let player = players.find((player) => player.id === socket.id);
		player.x += moveSpeed;

		// 438 is the midpoint
		if (player.x > 438 && player.team === "red" && player.hasFlag) {
			redScore++;
			player.hasFlag = false;
		}
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
			console.log("Player disconnected. " + socket.id);
		} else {
			console.log("Could not remove player on disconnect. " + socket.id);
		}

		playerCt--;
		if (playerCt === 0) {
			// No players left :(
			blueScore = 0;
			redScore = 0;
		}
	});
});

setInterval(function () {
	io.sockets.emit("refresh", players);
}, 50);

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
