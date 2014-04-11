/**
 * Created by liuqing on 14-4-10.
 */

exports.index = function(query){
	this.render('index', {
		title: '首页',
		jobs: [
			{
				title: '前端开发',
				city: '北京',
				pay: '10000+',
				exp: '3-5',
				education: '大专',
				tempt: '美女众多，待遇很好！',
				time: '2014-04-11',
				company: '360',
				territory: '安全',
				originator: '周鸿祎',
				stage: '上市',
				scale: '4000+',
				welfare: '美女，班车'
			}
		]
	});
}