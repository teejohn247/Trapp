let path = require('path');
let fs = require('fs');
let Model = require('../models');
let md5 = require('md5');
let sidebar = require('../helpers/sidebar')

module.exports = {
	index: (req, res) => {
		let viewModel ={
			image: {},
			comments: []
		}
		Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(err){throw err;}

			if(image){
				image.views += 1;
				image.save();
				viewModel.image = image;

				Model.Comment.find({image_id: image._id},function(err, comments){
					if (err) {throw err}

					viewModel.comments = comments;

					sidebar(viewModel, function(viewModel){

					res.render('image', viewModel);	

					});

							
				});
			}
			else{
				res.redirect('/')
			}
		})
	},
	create: (req, res) =>{
		function saveImage() {
			let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
			let imgUrl = '';

			for ( i = 0; i < 6; i++) {
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			Model.Image.find({'filename':imgUrl}, function(err, images){ // checking if there is an image with the same id
				if(err){throw err;}

				if(images.length > 0){
					saveImage();
				}
				else{

					let tempPath = req.file.path;
					let ext = path.extname(req.file.originalname).toLowerCase();
					let targePath = path.resolve('./public/upload/' + imgUrl + ext);

					if(ext === '.jpg' || ext == '.jpeg' || ext == '.png' || ext === '.gif'){
						fs.rename(tempPath, targePath, function(err){
							if(err){ throw err }

							let newImg = new Model.Image({
								title:req.body.title
								, description:req.body.description
								, filename:imgUrl + ext
							})

							newImg.save(function(){
								console.log('Image Saved Successfully');
								res.redirect('/logged');
							});
	
						});
					}
					else{
						fs.unlink(tempPath, function(err){
							res.status(500).json({ 'Error': 'Invalid Image format' })
						});

					}
				}
			})	

		}

		saveImage();

	},
		/*code to allow a user like the image uploaded*/
	like: function(req, res){
			Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(!err && image){
				image.likes += 1;
				image.save(function(err){
					if(err){
						res.json(err);
					}
					else{
						res.json({likes: image.likes});
					}
				});
			}
			else{
				res.redirect('/');
			}
		});
	},

			/*
				code to allow the user delete an image
				checking for an image
				delete from the folder
				and deleting the image from the db

			*/
	remove: function(req, res){
			Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
				if(err){throw err;}

				if(image){
					fs.unlink(path.resolve('./public/upload/' + image.filename), function(err){
						if(err){throw err;}

						Model.Comment.remove({image_id:image._id}, function(err){
							if (err){throw err;}
							image.remove(function(err){
							if(err){
								res.json(false);
							}
							else{
								res.json(true);
							}
						});
					})

					});	/* fs unlink is used to delete the image . the dot means from the current directory*/
				}
				else{
					res.redirect('/');
				}
			});
	},


	comment: function(req, res){
		Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(!err && image){
				let newComment = new Model.Comment(req.body);
				newComment.image_id = image._id;
				newComment.gravatar = md5(req.body.email);

				newComment.save(function(err, comment){
					console.log('Comment Posted Successfully');
					res.redirect('/image/' + image.uniqueId + '#' + comment._id);
				});
	
			}
			else{
				res.redirect('/');
			}
		});
	},

	chatroom: (req, res) =>{
		res.render('chatroom')
	}


}
