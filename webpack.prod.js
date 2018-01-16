var path = require('path'),
	webpack = require('webpack'),
	srcDir = path.resolve(process.cwd(), 'client'),
	imagePath = path.resolve(srcDir, 'img'),
	cssPath = path.resolve(srcDir, 'css'),
	jsPath = path.resolve(srcDir, 'js'),
	viewsPath = path.resolve(srcDir, 'views'),
	nodeModulesPath = path.resolve(__dirname, 'node_modules'),
	autoprefixer = require('autoprefixer'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	pxtorem = require('postcss-pxtorem');
	// CleanPlugin = require('clean-webpack-plugin');

let webpackConfig = {
	entry: {
		index: ['babel-polyfill', 	path.join(__dirname, 'client/entry.dev.jsx')]
	},
	output: {
		publicPath: './',
		path: path.join(__dirname, 'dist/'), //文件输出目录
		filename: 'core/[name].[hash:5].js', //根据入口文件输出的对应多个文件名
		chunkFilename: 'core/[name].[chunkhash:5].js'
	},
	resolve: {
		extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.react.js'],
		alias: { //配置别名，在项目中可缩减引用路径
			app: path.resolve(__dirname, 'app'),
			view: path.resolve(__dirname, 'app/view'),
			components: path.resolve(__dirname, 'app/components'),
			// stores: path.resolve(__dirname, 'app/stores'),
			assets: path.resolve(__dirname, 'assets'),
			images: path.resolve(__dirname, 'assets/images'),
			utils: path.resolve(__dirname, 'app/utils'),
		}
	},
	module: {
		rules: [{
			test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif|mp4|webm)(\?\S*)?$/,
			exclude: [nodeModulesPath],
			include: [srcDir],
			loader: 'url-loader?limit=8192&name=img/[name].[ext]',
		},
		{
			test: /\.(css|scss|sass)$/,
			use: ExtractTextPlugin.extract({
				use: [{
					loader: 'css-loader',
				},
				{
					loader: 'postcss-loader',
					options: {
						plugins: [autoprefixer, pxtorem({
							rootValue: 50,
							minPixelValue: 3,
							propWhiteList: [],
						})]
					}
				}, {
					loader: 'sass-loader',
					options: {
						imagePath: imagePath,
						includePaths: [cssPath]
					}
				}
				],
				fallback: 'style-loader'
			})
		},
		{
			test: /\.svg$/,
			loader: 'svg-sprite-loader',
			include: [require.resolve('antd-mobile').replace(/warn\.js$/, '')],
		},
		{
			test: /\.(js|jsx)$/,
			exclude: [nodeModulesPath],
			include: [srcDir],
			loader: 'babel-loader'
		}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		}),
		new webpack.DllReferencePlugin({ // 加快webpack打包速度
			context: __dirname,
			manifest: require('./dist/manifest.json')
		}),
		new ExtractTextPlugin('css/[name].[contenthash:5].css'),
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false,
			},
			compress: {
				warnings: false
			}
		}),
		new HtmlWebpackPlugin({
			filename: path.resolve(__dirname, './dist/index.html'),
			template: path.resolve(__dirname, './app/index.html'),
			inject: true
		})
	]
};


// webpackConfig.plugins.push(new CleanPlugin(['core'], {
// 	root: path.join(__dirname, "dist/static"),
// 	verbose: true,
// 	dry: false
// }));
// webpackConfig.plugins.push(new CleanPlugin(['img'], {
// 	root: path.join(__dirname, "dist/static"),
// 	verbose: true,
// 	dry: false
// }));
// webpackConfig.plugins.push(new CleanPlugin(['lib'], {
// 	root: path.join(__dirname, "dist/static"),
// 	verbose: true,
// 	dry: false
// }));


module.exports = webpackConfig;
