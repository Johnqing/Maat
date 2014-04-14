var Res = {}

/**
 * 重定向
 * @param url
 */
Res.redirect = function(location){
	this.res.writeHead(301, {'Location': location});
	this.res.end();
}

module.exports = Res;