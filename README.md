Maat
====

> nodejs框架。别学别写的一个东东


## 说明

```
config　　　　框架自身的配置文件存在
	+ contentTypes.js     类型配置
controllers  控制器存放文件夹（可在config.js中配置）
lib          基础
	+ controller.js     核心控制（连接一切的类）
	+ routes.js         扫描controller
	+ until.js          工具方法
NT           模板引擎
static       静态文件目录（可在config.js中配置）
View         模板目录
server.js    服务相关代码
config.js    配置文件
render.js    渲染器
app.js       启动文件,可配置端口
```
