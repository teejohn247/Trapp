let mongoose = require('mongoose');
let schema = mongoose.Schema;
let objectId = schema.ObjectId;


let ComentSchema = new schema({
	image_id: {type: objectId},
	name: {type: String},
	email: {type: String},
	comment: {type: String},
	gravatar: {type: String},
	timestamp: {type: Date, 'default': Date.now}
});

	ComentSchema.virtual('virtual').set(function(image){
		this.comment_image = image;
	}).get(function(){
		return this.comment_image;
	});

	module.exports = mongoose.model('comment', ComentSchema);