// Using vanilla JavaScript to create the server:
/*
	let http = require('http');

	http.createServer(function(req, res){
		res.writeHead(200, {'Content-Type':'text/plain'});
	 	res.end('Hello World. \nWelcome to JavaScript Backend Development');
 	}).listen(8080, 'localhost');
 console.log('server running at http://localhost:8080');

 */




/*
	app.set('port', process.env.PORT || 8080);

	app.get('/',function(req, res){
		res.send("Welcome to Flickagram. Thank you!");

	});

	app.get('/about', function(req, res){
		res.send('Welcome to the About Page of Flickagram');
	});

	app.get('/about/:any', function(req, res){
		res.send('Welcome to the ' + req.params.any + ' section of the About Page of Flickagram');
	});

	app.get('/hiitplc', function(req, res){
		res.redirect('https://www.hiitplc.com')
	});

	app.get('/file', function(req, res){
		res.sendFile('C:/Users/JIDE OGUNLANA/Videos/---Ghajini - Kaise Mujhe (With English Subtitles).mp4')
	})



app.listen(app.get('port'),function(){
	console.log('Server running at http://localhost: ' + app.get('port'));
});

*/

const express = require('express');
let app = express();
let config = require('./server/configure');
let mongoose = require('mongoose');

app.set('port', process.env.PORT || 8080);

app = config(app);

mongoose.connect('mongodb://localhost/flickagram');

var server = app.listen(app.get('port'),function(){
	console.log('Server running at http://localhost: ' + app.get('port'));
});

require('./server/chat_server.js').initialize(server);

