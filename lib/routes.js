/**
 * Created by liuqing on 14-4-10.
 */
var until = require('./until'),
	path = require('path'),
	config = require('../config');

exports.getController = function(cb){
	var ctlPath = config.controller.URI || './controllers';

	ctlPath = path.resolve(ctlPath);

	until.walk(ctlPath, function(paths){
		cb(paths);
	});

}
