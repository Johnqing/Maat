var until = require('./until');
var response = require('./response');
var render = require('../render');

/**
 * 控制器管理
 * @param req
 * @param res
 * @constructor
 */
var Controller = function(req, res){
	this.req = req;
	this.res = res;
}

Controller.prototype = {
	h404: function(){
		this.res.writeHead(404, {'Content-Type': 'text/plain'});
		this.res.end('Page not find!');
	},
	h500: function(err){
		this.res.writeHead(500, {'Content-Type': 'text/plain'});
		this.res.end(err);
	},
	render: function(viewName, data){
		render.call(this, viewName, data);
	}
}

until.extend(Controller.prototype, response);


module.exports = Controller;