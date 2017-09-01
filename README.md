# foodtruck
项目主题为：Food trucks
开发方向：前端
后端选择的开发语言为：PHP
前端开发中引用了百度地图Js库，从CDN中引用了jQuery，respond.js。开发完源代码后使用了Gulp进行静态资源的压缩、版本后缀替换等工作。
#
项目目录结构：
1.src目录下放置静态源文件，包括html、css、js、image文件。
2.build目录下放置经过压缩、版本后缀替换后的静态文件。
3.根目录下的service.php文件是应用的后端服务程序。
4.根目录下的Gulpfile.js是使用Gulp构建前端的源代码。
5.根目录下的foodstrucks.json是题目中提供的数据文件。
6.根目录下的index.html是应用的界面。
#
使用说明：
地图中黄色标记代表个人位置节点，移动节点可以查看附近2公里内最近的20个Food Truck，并以红色标记显示在地图上，点击红色标记显示概要信息。
在搜索框中输入要搜索的信息，可搜索满足模糊匹配的距离最近的20个节点。
