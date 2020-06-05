// FOR LUKE AND TREVOR -- START

$("#field").keydown(function(e) {
	var key = e.which;
	switch (key) {
		// W or up arrow
		case 87:
		case 38:
			console.log("Pressed up");
			socket.broadcast.emit('up');
			break;
	}
})





// // FOR LUKE AND TREVOR -- END

// Just for testing positioning things.


var testPlayer = {x: 886, y: 586}
$("#testRed").css({"bottom": testPlayer.y + "px", "left": testPlayer.x + "px"})