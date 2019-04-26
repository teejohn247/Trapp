/*
	app.use(function(req, res, next){
		console.log('Request Method ' + req.method);
		console.log('Request Url ' +  req.url);
		console.log('Request Time '+ new Date()); 
		next();
	});
	app.use(function(req, res, next){
		let filePath = path.join(__dirname, '../static', req.url);
		fs.stat(filePath, function(err, fileInfo){
			if(err){
				next();
				return;
			}

			if(fileInfo.isFile()){
				res.sendFile(filePath);

			}
			else{
				next();
			}
		})

	});

	routes(app);

	app.use(function(req, res){
		res.status(404).send('File Not Found');
	});
*/



let routes = require('./routes');
let morgan = require('morgan');
let path = require('path');
let express = require('express');
let favicon = require('serve-favicon');
let exphbs = require('express-handlebars');
let multer = require('multer');
let bodyParser = require('body-parser');
let moment = require('moment');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let passport = require('passport');
let setUpPassport = require('./setUpPassport');
let expressValidator = require('express-validator');
let flash = require('express-flash');

module.exports = function(app){
	app.use(favicon(path.join(__dirname, '../public', 'img', 'favicon.ico')));

	app.use(morgan('dev'));

	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
	app.use(expressValidator());	// placed after bodyparser package because it depends on it

	app.use(multer({'dest': './public/upload/temp'}).single('file'));

	app.use(cookieParser());

	app.use(session({
		secret:'T$djof&$%£&ei+&6^',
		resave: false, 	// false ensures the login is not persisted
		saveUninitialize: false // if the session has not been modified don't save it

	}));

	app.use(passport.initialize());

	app.use(passport.session());

	setUpPassport();		// this a separate file we created ourselves not a module

	app.use(flash())	// placed after the sesssion package because it depends on it

	app.use('/public/', express.static(path.join(__dirname, '../public')));

	routes(app);

	app.engine('handlebars', exphbs.create({
		helpers: {
			timeago: function(timestamp){
				return moment(timestamp).startOf('minute').fromNow();
			}
		}
	}).engine);
		
	app.set('view engine', 'handlebars');


	app.use(function(req, res){
		res.status(404).send('File Not Found');
	});

	return app;
}