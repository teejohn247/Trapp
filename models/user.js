// stores the user information

let mongoose = require('mongoose');
let schema = mongoose.Schema;
let bcrypt = require('bcrypt-nodejs');

let userSchema = new schema({
	name: {type:String},
	email: {type:String },
	password: {type:String},
	dateCreated: {type:Date, 'default':Date.now}

});

//we would be creating custom method with mongoose

userSchema.methods.encryptPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10))	// saltsync determines the level of encryption
}

userSchema.methods.checkPassword = function(guessPassword) {
	return bcrypt.compareSync(guessPassword, this.password);
}

module.exports = mongoose.model('user', userSchema);