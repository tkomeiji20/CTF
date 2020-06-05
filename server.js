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
		if (players.find((player) => player.id === socket.id).y < 576 - moveSpeed) {
			players.find((player) => player.id === socket.id).y += moveSpeed;
		} else {
			players.find((player) => player.id === socket.id).y = 576;
		}
	});

	socket.on("down", function () {
		debug && console.log("Moved down");
		if (players.find((player) => player.id === socket.id).y > 0 + moveSpeed) {
			players.find((player) => player.id === socket.id).y -= moveSpeed;
		} else {
			players.find((player) => player.id === socket.id).y = 0;
		}
	});

	socket.on("left", function () {
		debug && console.log("Moved left");
		let player = players.find((player) => player.id === socket.id);
		if (player.x > 0 + moveSpeed) {
			player.x -= moveSpeed;
		} else {
			player.x = 0;
		}

		// 438 is the midpoint
		if (player.x < 438 && player.team === "blue" && player.hasFlag) {
			redScore++;
			player.hasFlag = false;
		}
	});

	socket.on("right", function () {
		debug && console.log("Moved right");
		let player = players.find((player) => player.id === socket.id);
		if (player.x < 876 - moveSpeed) {
			player.x += moveSpeed;
		} else {
			player.x = 876;
		}
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
	for (const playerI of players) {
		for (const playerJ of players) {
			if (!(playerI.id === playerJ.id)) {
				if (
					Math.abs(playerI.x - playerJ.x) < 20 &&
					Math.abs(playerI.y - playerJ.y) < 20
				) {
					// collide
					console.log("uh oh!");
				}
			}
		}

		if (Math.abs(playerI.x - 30) < 30 && Math.abs(playerI.y - 278) < 30 && playerI.team === "blue") {
			// touching red flag
			console.log("blue has flag")
		}
	}
	io.sockets.emit("refresh", { players, blueScore, redScore });
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
