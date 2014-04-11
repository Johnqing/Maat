/**
 * Created by liuqing on 14-4-10.
 */

exports.index = function(query){
	if(query.a){

		this.render('index', {
			title: 'index-a'
		});

		return

	}
	this.render('index', {
		title: '首页'
	});
}