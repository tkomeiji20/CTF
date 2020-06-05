const debug = !process.env.NODE_ENV;
console.log("Environment: ", process.env.NODE_ENV || "dev");
console.log("Debugging: ", debug);

const express = require("express"),
	app = express(),
	server = app.listen(process.env.PORT || process.argv[2] || 8080, () => {
		console.log(server.address());
	}),
	helmet = require("helmet"),
	io = require("socket.io")(server);

app.use(helmet());
app.use(express.static(__dirname + "/public"));

let playerCt = 0,
	players = [],
	blueScore = 0,
	redScore = 0,
	moveSpeed = 5;

io.on("connection", function (socket) {
	// Socket stuff in here
	// Add new object to team arrays
	debug && console.log("Player connected!");

	playerCt++;
	if (playerCt % 2 == 1) {
		players.push({
			team: "red",
			x: 100,
			y: 576 / 2,
			id: socket.id,
			hasFlag: false,
		});
		socket.emit("newPlayer", socket.id, "red");
	} else {
		players.push({
			team: "blue",
			x: 876 - 100,
			y: 576 / 2,
			id: socket.id,
			hasFlag: false,
		});
		socket.emit("newPlayer", socket.id, "blue");
	}
	const player = players.find((player) => player.id === socket.id);
	socket.on("up", function () {
		debug && console.log("Moved up");
		if (player.y < 576 - moveSpeed) {
			player.y += moveSpeed;
		} else {
			player.y = 576;
		}
	});

	socket.on("down", function () {
		debug && console.log("Moved down");
		if (
			players.find((player) => player.id === socket.id).y >
			0 + moveSpeed
		) {
			players.find((player) => player.id === socket.id).y -= moveSpeed;
		} else {
			player.y = 0;
		}
	});

	socket.on("left", function () {
		debug && console.log("Moved left");
		if (player.x > 0 + moveSpeed) {
			player.x -= moveSpeed;
		} else {
			player.x = 0;
		}

		// 438 is the midpoint
		if (player.x < 438 && player.team === "red" && player.hasFlag) {
			redScore++;
			player.hasFlag = false;
			player.x = 100;
			player.y = 576 / 2;
		}
	});

	socket.on("right", function () {
		debug && console.log("Moved right");
		if (player.x < 876 - moveSpeed) {
			player.x += moveSpeed;
		} else {
			player.x = 876;
		}
		// 438 is the midpoint
		if (player.x > 438 && player.team === "blue" && player.hasFlag) {
			blueScore++;
			player.hasFlag = false;
			player.x = 876 - 100;
			player.y = 576 / 2;
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
			debug && console.log("Player disconnected. " + socket.id);
		} else {
			console.log("Could not remove player on disconnect. " + socket.id);
		}

		playerCt--;
		if (playerCt === 0) {
			console.log("Server reset.");
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
					playerI.x < playerJ.x + 21 &&
					playerI.x + 21 > playerJ.x &&
					playerI.y < playerJ.y + 21 &&
					playerI.y + 21 > playerJ.y
				) {
					// Collided
					if (playerI.team === "red" && playerI.x > 438 && playerJ.team === "blue") {
						playerI.x = 100;
						playerI.y = 576 / 2;
						playerI.hasFlag = false;
					} else if (playerI.team === "blue" && playerI.x < 438 && playerJ.team === "red") {
						playerI.x = 876 - 100;
						playerI.y = 576 / 2;
						playerI.hasFlag = false;
					}
				}
			}
		}

		if (
			Math.abs(playerI.x - 30) < 30 &&
			Math.abs(playerI.y - 278 - 20) < 30 &&
			playerI.team === "blue"
		) {
			// blue guy touching red flag
			if (players.map((player) => {return player.team === "blue" && player.hasFlag && player.id !== playerI.id}).indexOf(true) < 0) {
				// no other blue guy touching flag
				playerI.hasFlag = true;
			}
			
		}
		if (
			Math.abs(playerI.x - 841) < 30 &&
			Math.abs(playerI.y - 278 - 20) < 30 &&
			playerI.team === "red"
		) {
			// red guy touching blue flag
			if (players.map((player) => {return player.team === "red" && player.hasFlag && player.id !== playerI.id}).indexOf(true) < 0) {
				// no other red guy touching flag
				playerI.hasFlag = true;
			}
		}

		if (
			playerI.hasFlag === true &&
			playerI.team === "red" &&
			playerI.x < 438
		) {
			redScore++;
		} else if (
			playerI.hasFlag === true &&
			playerI.team === "blue" &&
			playerI.x > 438
		) {
			blueScore++;
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
