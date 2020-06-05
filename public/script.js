// FOR LUKE AND TREVOR -- START

$("#field").keydown(function(e) {
	var key = e.which;
	switch (key) {
		// W or up arrow
		case 87:
		case 38:
			socket.broadcast.emit('up');
			break;
	}
})





// // FOR LUKE AND TREVOR -- END

// Just for testing positioning things.

var testPlayer = {x: 20, y: 40}
$("#test").css({"top":testPlayer.x, "left":testPlayer.x})