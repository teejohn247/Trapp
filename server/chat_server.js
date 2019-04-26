var io = require('socket.io');

exports.initialize = function(server) {
	io = io.listen(server);

	io.sockets.on("connection", function(socket) {
		console.log("A NEW CONNECTION WAS JUST MADE   " + socket.id);

		socket.send(JSON.stringify({
			type: 'serverMessage',
			message: 'Welcome to the most interesting chat room on earth!'
		}));

		// code for what happens between the user and the receiever
		socket.on('message', function(message){
			message = JSON.parse(message);
			if (message.type == "userMessage") {
				socket.broadcast.send(JSON.stringify(message));
				message.type = "myMessage";
				socket.send(JSON.stringify(message));
			}
		});


		//code for real time likes
		socket.on('message', function(message){
			console.log('MESSAGE IN IO SERVER IS = ' + message);
			message = JSON.parse(message);
			if (message.type == 'userLikes') {
				socket.broadcast.send(JSON.stringify(message));
				socket.send(JSON.stringify(message));
			}
		});
	});
}