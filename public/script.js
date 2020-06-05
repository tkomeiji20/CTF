// FOR LUKE AND TREVOR -- START
let socket = io();
let playerList = [];

// socket.on("newPlayer", function (id, team) {
// 	$("#field").append(`<div id="${id}" class="player ${team}"></div>`);
// 	$(`#${id}`).css({ bottom: 0, left: 0 });
// });

// TODO next
// https://stackoverflow.com/questions/10655202/detect-multiple-keys-on-single-keypress-event-in-jquery
// make it so hasFlag can only be set for one user

let keyMap = { 87: false, 83: false, 65: false, 68: false };

$("body")
	.keydown(function (e) {
		let key = e.which;
		if (key in keyMap) {
			keyMap[key] = true;
		}

		// Move up
		// if (key == 87 || key == 38) {
		// 	console.log("Pressed up");
		// 	socket.emit("up");
		// }
		// // Move down
		// if (key == 83 || key == 40) {
		// 	console.log("Pressed down");
		// 	socket.emit("down");
		// }
		// // Move left
		// if (key == 65 || key == 37) {
		// 	console.log("Pressed left");
		// 	socket.emit("left");
		// }
		// if (key == 68 || key == 39) {
		// 	console.log("Pressed right");
		// 	socket.emit("right");
		// }

		// switch (key) {
		// 	// W or up arrow
		// 	case 87:
		// 	case 38:
		// 		console.log("Pressed up");
		// 		socket.emit("up");
		// 		break;
		// 	case 83:
		// 	case 40:
		// 		console.log("Pressed down");
		// 		socket.emit("down");
		// 		break;
		// 	case 65:
		// 	case 37:
		// 		console.log("Pressed left");
		// 		socket.emit("left");
		// 		break;
		// 	case 68:
		// 	case 39:
		// 		console.log("Pressed right");
		// 		socket.emit("right");
		// 		break;
		// }
	})
	.keyup(function (e) {
		let key = e.which;
		if (key in keyMap) {
			keyMap[key] = false;
		}
	});

setInterval(() => {
	if (keyMap[87]) {
		socket.emit("up");
	}
	if (keyMap[83]) {
		socket.emit("down");
	}
	if (keyMap[65]) {
		socket.emit("left");
	}
	if (keyMap[68]) {
		socket.emit("right");
	}
}, 50);

socket.on("refresh", function ({ players, redScore, blueScore }) {
	$("#redScore").html(redScore);
	$("#blueScore").html(blueScore);
	// console.log("received players!");
	for (let i = 0; i < players.length; i++) {
		var myEle = document.getElementById(`${players[i].id}`);
		if (!myEle) {
			// does not exist yet
			playerList.push(players[i].id);
			$("#field").append(
				`<div id="${players[i].id}" class="player ${players[i].team}"></div>`
			);
			$(`#${players[i].id}`).animate(
				{ bottom: players[i].y + "px", left: players[i].x + "px" },
				0
			);
		} else {
			$(`#${players[i].id}`).clearQueue();
			$(`#${players[i].id}`).animate(
				{ bottom: players[i].y + "px", left: players[i].x + "px" },
				70
			);
		}
		if (players[i].hasFlag) {
			$(`#${players[i].id}`).addClass("hasFlag");
		} else {
			$(`#${players[i].id}`).removeClass("hasFlag");
		}
	}
	for (let i = 0; i < playerList.length; i++) {
		if (
			players
				.map((player) => {
					return player.id;
				})
				.indexOf(playerList[i]) < 0
		) {
			// player went away
			$(`#${playerList[i]}`).remove();
			playerList.splice(i, 1);
		}
	}
});

// // FOR LUKE AND TREVOR -- END

// Just for testing positioning things.

// var testPlayer = { x: 876, y: 576 };
// $("#testRed").css({ bottom: testPlayer.y + "px", left: testPlayer.x + "px" });
