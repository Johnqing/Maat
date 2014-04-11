/**
 * Created by liuqing on 14-4-11.
 */
var path = require('path');
var NT = require('./NT/index');
var config = require('./config');
/**
 * 渲染页面
 * @param viewName
 * @param data
 */
var render = function(viewName, data){
	var filePath = path.join(__dirname, config.viewDir, viewName + '.html');
	try{
		var output = NT.tpl(filePath, data);
	} catch (err){
		this.h500(err);
		return
	}
	this.res.writeHead(200, {'Content-Type': 'text/html'});
	this.res.end(output);
}

module.exports = render;