module.exports = function(req, res, next){
	//isAuthenticate() is a passport method
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/')	
	}
}