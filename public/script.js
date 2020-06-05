// FOR LUKE AND TREVOR -- START
let socket = io();

socket.on('newPlayer', function(id, team) {
    $("#field").append(`<div id="${id}" class="player ${team}"></div>`);
    $(`#${id}`).css({bottom: 0, left: 0});
});

$("body").keydown(function (e) {
	var key = e.which;

	// Move up
	if (key == 87 || key == 38) {
		console.log("Pressed up");
		socket.emit("up");
	}
	// Move down
	else if (key == 83 || key == 40) {
		console.log("Pressed down");
		socket.emit("down");
	}
	// Move left
	else if (key == 65 || key == 37) {
		console.log("Pressed left");
		socket.emit("left");
	}
	else if (key == 68 || key == 39) {
		console.log("Pressed right");
		socket.emit("right");
	}
/* 
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
	} */
});

socket.on("refresh", function (players) {
    // console.log("received players!");
    for (let i = 0; i < players.length; i++) {
        var myEle = document.getElementById(`${players[i].id}`);
        if (myEle) {
            $(`#${players[i].id}`).clearQueue();
            $(`#${players[i].id}`).animate({ bottom: players[i].y + "px", left: players[i].x + "px" }, 30);
        }
        else {
            $("#field").append(`<div id="${players[i].id}" class="player ${players[i].team}"></div>`);
            $(`#${players[i].id}`).clearQueue();
            $(`#${players[i].id}`).animate({ bottom: players[i].y + "px", left: players[i].x + "px" }, 30);
        }
    }
});

// // FOR LUKE AND TREVOR -- END

// Just for testing positioning things.

// var testPlayer = { x: 876, y: 576 };
// $("#testRed").css({ bottom: testPlayer.y + "px", left: testPlayer.x + "px" });
