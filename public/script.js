// FOR LUKE AND TREVOR -- START
let socket = io();

$("body").keydown(function (e) {
	var key = e.which;
	switch (key) {
		// W or up arrow
		case 87:
		case 38:
			console.log("Pressed up");
			socket.emit("up");
			break;
		case 83:
		case 40:
			console.log("Pressed down");
			socket.emit("down");
			break;
		case 65:
		case 37:
			console.log("Pressed left");
			socket.emit("left");
			break;
		case 68:
		case 39:
			console.log("Pressed right");
			socket.emit("right");
			break;
	}
});

// // FOR LUKE AND TREVOR -- END

// Just for testing positioning things.

var testPlayer = { x: 886, y: 586 };
$("#testRed").css({ bottom: testPlayer.y + "px", left: testPlayer.x + "px" });
