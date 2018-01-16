var http = require('http');
var express = require('express');
var path = require('path');
var app = express(); //生成一个express实例 app
app.set('views', path.join(__dirname, 'dist')); //设置存放视图文件或者说模版文件的目录
app.use(express.static(path.join(__dirname, 'dist'))); //设置存放 image、css、js 等静态文件的目录

app.get('/**', function (req, res) {
    res.header('Cache-Control', 'no-cache');
    res.sendfile('dist/index.html');
});

var server = http.createServer(app);
server.listen(3322);
console.log('端口:',3322);
