const express = require('express');
let router = express.Router();
let home = require('../controllers/home');
let image = require('../controllers/image');
let passport = require('passport');
let isLogged = require('./islogged');

module.exports = function(app){
	router.get('/', home.login);

	router.get('/logged', isLogged, home.index);

	router.get('/logout', home.logout);

	router.get('/classwork', function(req, res){
		res.render('classwork');
	});

	router.post('/signup', home.signup);

	router.post('/login', passport.authenticate('local-login',{// it takes some keys
		successRedirect:'/logged',
		failureRedirect:'/'

	}));

	router.get('/image/:image_id', isLogged, image.index);

	router.post('/image',image.create);

	router.post('/image/:image_id/like', image.like);

	router.delete('/image/:image_id', image.remove);

	router.post('/image/:image_id/comment', image.comment);

	router.get('/chatroom', image.chatroom);
	
	
	router.get('/about', function(req, res){
		//res.send('Welcome to Flickagram About Page.');
		res.render('about');
		
	});


	app.use(router);
}
