let async = require('async');
let stats = require('./stat');
let images = require('./image');
let comments = require('./comment');

module.exports = function(viewmodel, callback){
	async.parallel([
		function(next){
			stats(next);
		},
		function(next){
			images.popular(next);
		},
		function(next){
			comments.newest(next);
		}

		], function(err, results){
			viewmodel.sidebar = {
				stats: results[0],
				popular: results[1],
				newest: results[2]
			}
			callback(viewmodel);	// the callback fxn helps call other fxns when done with one
	})
}