let async = require('async');
let Models = require('../models');

// 	retrieve all comments limit the comments to 5 and sort them by their time stamp 
module.exports =  {

	newest: function(callback){
		Models.Comment.find({},{},{limit: 5, sort:{'timestamp': -1}}, function(err, comments){
			if(err){throw err;}

			let attachImage = function(comment, next){
				Models.Image.findOne({_id: comment.image_id}, function(err, image){
					comment.image = image; // using a virtual

					if (err) {throw err;}

					next(err);


				})
			}

			async.each(comments, attachImage, function(err){
				if (err){throw err;}
				callback(err, comments)

			});
		});
	}
}

