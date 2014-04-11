/**
 * Created by liuqing on 14-4-10.
 */
var parseURL = require('url').parse,
	path = require('path'),
	fs = require('fs')

var isType = function(type){
	return function(obj){
		return {}.toString.call(obj) == '[object '+type+']';
	}
}
var isArray = isType('Array');

exports.isArray = isArray;

/**
 * 遍历文件夹以及文件
 * @type {{}}
 */
var walk = function() {
	function collect(opts, el, prop) {
		if ((typeof opts.filter == "function") ? opts.filter(el) : true) {
			opts[prop].push(el);
			if (opts.one === true) {
				opts.filter = function() {
					return false;
				};
				opts.count = 0;
			}
		}
	}
	function sync(p, opts) {
		try {
			var stat = fs.statSync(p);
			var prop = stat.isDirectory() ? "dirs": "files";
			collect(opts, p, prop);
			if (prop === "dirs") {
				var array = fs.readdirSync(p);
				for (var i = 0, n = array.length; i < n; i++) {
					sync(path.join(p, array[i]), opts);
				}
			}
		} catch(e) {}
	};
	function async(p, opts) {
		opts.count++;
		fs.stat(p, function(e, s) {
			opts.count--;
			if (!e) {
				if (s.isDirectory()) {
					collect(opts, p, "dirs");
					opts.count++;
					fs.readdir(p, function(e, array) {
						opts.count--;

						for (var i = 0, n = array.length; i < n; i++) {
							async(path.join(p, array[i]), opts);
						}
						if (opts.count === 0) {
							opts.cb(opts.files, opts.dirs);
						}
					});
				} else {
					collect(opts, p, "files");
				}
				if (opts.count === 0) {
					opts.cb(opts.files, opts.dirs);
				}
			}

			if (e && e.code === "ENOENT") {
				opts.cb(opts.files, opts.dirs);
			}
		});
	};
	return function(p, cb, opts) {
		if (typeof cb == "object") {
			opts = cb;
			cb = opts.cb;
		}
		opts = opts || {};
		opts.files = [];
		opts.dirs = [];
		opts.cb = typeof cb === "function" ? cb: function(){};
		opts.count = 0;
		if (opts.sync) {
			sync(path.normalize(p), opts);
			opts.cb(opts.files, opts.dirs);
		} else {
			async(path.normalize(p), opts);
		}
	};
}();
exports.walk = walk;
/**
 * md5
 * @type {exports}
 */
var crypto = require('crypto');
exports.md5 = function (text) {
	return crypto.createHash('md5').update(text).digest('hex');
};