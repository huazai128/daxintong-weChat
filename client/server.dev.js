import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config.js';
// import webpackConfig from '../webpack.con.js';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
// import user from './user';

const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(compiler, {
	// webpack-dev-server options

	contentBase: webpackConfig.output.path, //本地服务器所加载的页面所在的目录
	// Can also be an array, or: contentBase: "http://localhost/",

	hot: true,
	// Enable special support for Hot Module Replacement
	// Page is no longer updated, but a "webpackHotUpdate" message is sent to the content
	// Use "webpack/hot/dev-server" as additional module in your entry point
	// Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

	historyApiFallback: true, //不跳转
	// Set this as true if you want to access dev server from arbitrary url.

	// setup: app => {
	// 	// Here you can access the Express app object and add your own custom middleware to it.
	// 	// For example, to define custom handlers for some paths:
	// 	// app.get('/some/path', function (req, res) {
	// 	// 	res.send({
	// 	// 		custom: 'response'
	// 	// 	});
	// 	// });
	// 	// user(app);
	// },
});

server.listen(8080, () => {
	console.log('监听端口 ===> localhost：8080');
});
// server.close();
