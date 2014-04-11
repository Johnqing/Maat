/**
 * Created by liuqing on 14-4-10.
 */
var http = require('http');
var path = require('path');
var fs = require('fs');
var query = require('querystring');
var URL = require('url');
var routes = require('./lib/routes');
var controllerList = {};
var config = require('./config.js');
var CT = require('./lib/controller.js');
var contentTypes = require('./config/contentTypes');

/**
 * query 解析
 * @param query
 * @returns {{}}
 */
function queryParse(query){
	if(!query) return {};
	var queryStr = query;
	var queryArr = queryStr.split('&');
	var queryObj = {};

	queryArr.forEach(function(item){
		var qArr = item.split('=');
		queryObj[qArr[0]] = qArr[1];
	});
	return queryObj;
}
/**
 * 服务器配置
 * @type {{run: run, handle: handle, static: static}}
 */
var server = {
	run: function(port){
		// 启动时，设置controller
		routes.getController(function(ctList){
			ctList.forEach(function(item){
				var baseName = path.basename(item, '.js');
				controllerList[baseName] = require(item);
			});
		});
		// 默认80端口
		port = port || 80;
		//启动
		http.createServer(function(req, res){
			var _data = '';

			req.on('data', function(chunk){
				console.log(chunk);
				_data += chunk;
			}).on('end', function(){
				req.post = query.parse(_data);

				server.handle(req, res);

			})

		}).listen(port);

		console.log('服务器已经启动(http://127.0.0.1:'+port+')');
	},
	/**
	 * 处理路由和action
	 * @param req
	 * @param res
	 */
	handle: function(req, res){
		var url = URL.parse(req.url);

		var pathnameArray = url.pathname.substring(1).split('/');
		if(!pathnameArray.length) return;
		var ctName = pathnameArray[0] || 'index';
		var action = pathnameArray[1] || 'index';
		// 没有这个controller时就按静态文件处理
		var ct = new CT(req, res);
		if(!controllerList[ctName]){
			server.static(ct, req, res);
			return;
		}
		/**
		 * 访问不存在的action，直接报错
		 */
		if(!controllerList[ctName][action]){
			ct.h500('Error: controller "' + ctName + '" without action "' + action + '"');
			return
		}

		controllerList[ctName][action].call(ct, queryParse(url.query));
	},
	/**
	 * 静态文件处理
	 * @param req
	 * @param res
	 * @param filePath
	 */
	static: function(ct, req, res, filePath){
		if(!filePath){
			filePath = path.join(__dirname, config.staticDir, URL.parse(req.url).pathname);
		}

		fs.exists(filePath, function(exists){
			if(!exists){
				ct.h404();
				return;
			}

			fs.readFile(filePath, "binary", function(err, file){
				if(err){
					ct.h500(err);
					return;
				}

				var ext = path.extname(filePath);
				ext = ext ? ext.slice(1) : 'html';
				res.writeHead(200, {'Content-Type': contentTypes[ext] || 'text/html'});
				res.write(file, "binary");
				res.end();
			});

		})

	}
}

exports.run = server.run