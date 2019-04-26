let passport = require('passport');
let localStrategy = require('passport-local').Strategy;
let User = require('../models/user');

module.exports = function(){
	passport.serializeUser(function(user, done){
		done(null, user.id)	 // done is a fxn
	}); // the serializeUser method takes the user id and stores in the browser as a key

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			if(err){
				done(err);
			}
			done(null, user);
		});
	});

	passport.use('local-login', new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done){
		User.findOne({'email':email}, function(err, user){
			if(err){ 
				return done(null, false);
			}

			if(!user){
				console.log('Email or password Incorrect');
				return done(null, false);
			}

			if(!user.checkPassword(password)){
				console.log('Email or password Incorrect');
				return done(null, false);
			}

			console.log('email and password correct')

			return done(null, user);


		})
	}));

}