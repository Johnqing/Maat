/**
 * Created by liuqing on 14-4-10.
 */
exports.create = function(){
	this.render('position', {
		title: '发布职位'
	});
}

exports.up = function(){
	this.redirect('http://127.0.0.1:1234/corpPosition/create');
}