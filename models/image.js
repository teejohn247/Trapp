let mongoose = require('mongoose');
let schema = mongoose.Schema;
let path = require('path');



let ImageSchema = new schema({
	title:{type:String}
	, description:{type:String}
	, filename:{type:String}
	, likes:{type:Number, 'default':0}
	, views:{type:Number, 'default':0}
	, timestamp:{type:Date, 'default':Date.now}
});

ImageSchema.virtual('uniqueId').get(function(){
	return this.filename.replace(path.extname(this.filename),'');

});

module.exports = mongoose.model('images', ImageSchema);

