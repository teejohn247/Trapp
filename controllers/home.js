let Models = require('../models');
let sidebar = require('../helpers/sidebar');


module.exports = {
	login: (req, res) => {
		let viewModel = {
			images:[]
		}

		Models.Image.find({},{},{limit:5, sort:{'likes':-1}}, function(err, images){
			if (err){throw err;}


			let count = 0;		// creating code to start the carousel from 1 because normally the array will start from 0
			let indicators = [];

			for(i=0; i < images.length ; i++){
				count += 1;
				indicators.push(count);
			}
			console.log(req.session);
			viewModel.images = images;
			viewModel.indicators = indicators; // we are putting images from our database into the images array in viewmodel
			viewModel.signUpErrors = req.session.errors
			viewModel.signupSuccess = req.flash('signupSuccess');
			viewModel.userExist = req.flash('userExist');

			res.render('login', viewModel);
			req.session.signUpErrors = null;
			
		});	
	},
	
	index: (req, res) => {
		let viewModel = {
			images:[]
		}

		Models.Image.find({},{},{sort:{'timestamp':-1}}, function(err, images){
			if (err){throw err;}


			viewModel.images = images;
			viewModel.user = req.user;

			sidebar(viewModel, function(viewModel){
				res.render('index', viewModel);
			});
		});	
	},

	signup:(req, res) => {
		req.check('name', 'Full name cannot be Empty').notEmpty();
		req.check('name', 'Full name must not contain numbers or signs e.g shola arabe').matches(/[a-zA-Z]*\s[a-zA-Z]*/).trim().escape();
		req.check('email','Email cannot be Empty').notEmpty();
		req.check('email', 'Invalid email format').isEmail();
		req.check('password', 'Password cannot be Empty').notEmpty();
		req.check('password', 'Your password should not be less than 8 characters').isLength({min:8});
		req.check('password', 'Password Mismatch').equals(req.body.confirmpassword);

		let errors = req.validationErrors();

		if(errors){
			req.session.errors = errors;
			res.redirect('/')
		}else{
			Models.User.findOne({'email':req.body.email}, function(err, user){
				if(err){throw err;}


				if(user){
					req.flash('userExist','User already exist!')
					res.redirect('/');
				}
				else{
					let newUser = new Models.User();
					newUser.name = req.body.name;
					newUser.email = req.body.email;
					newUser.password = newUser.encryptPassword(req.body.password);

					newUser.save(function(err){
						if(err){throw err;}

						req.flash('signupSuccess','User created succesfully');
						res.redirect('/');
					});
				}
			})
		}

	},

	logout:(req, res) => {
		req.logout();
		res.redirect('/');
	}
}