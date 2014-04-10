/**
 * Created by liuqing on 14-4-10.
 */
var http = require('http');
var path = require('path');
var query = require('querystring');
var parseURL = require('url').parse;
var routes = require('./lib/routes');
var controllerList = {};
var config = require('./config.js')
var contentTypes = require('./config/contentTypes')


var server = {
	run: function(port){
		// 启动时，设置controller
		routes.getController(function(ctList){
			ctList.forEach(function(item){
				var baseName = path.basename(item, '.js');
				controllerList[baseName] = require(item);
				console.log(item)
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
		var url = parseURL(req.url);
		var pathnameArray = url.pathname.substring(1).split('/');
		if(!pathnameArray.length) return;
		var ct = pathnameArray[0] || 'index';
		var action = pathnameArray[1] || 'index';
		// 没有这个controller时就按静态文件处理
		if(!controllerList[ct]){
			server.static(req, res)
			return;
		}
		controllerList[ct][action](req, res);
	},
	/**
	 * 静态文件处理
	 * @param req
	 * @param res
	 * @param filePath
	 */
	static: function(req, res, filePath){
		if(!filePath){
			filePath = path.join(__dirname, config.staticDir, url.parse(req.url).pathname);
		}

		path.exists(filePath, function(exists){
			if(!exists){
				return;
			}

			fs.readFile(filePath, "binary", function(err, file){
				if(err){
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