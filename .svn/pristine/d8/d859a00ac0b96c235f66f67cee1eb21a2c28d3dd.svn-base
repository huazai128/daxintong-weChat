import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import pkg from './package.json';

const svgDirs = [
	require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
	// path.resolve(__dirname, 'assets/iconfont'),  // 2. 自己私人的 svg 存放目录
];

// const modifyVars = {
// 	'@primary-color': '#7265e6',
// 	'@icon-url': JSON.stringify('/iconfont/iconfont'), // 把 iconfont 地址改到本地
// };

console.info(`当前环境：${process.env.NODE_ENV}`);

const webpackConfig = {
	entry: {
		fongwell: [
			// process.env.NODE_ENV !== 'production' ? path.join(__dirname, 'client/entry.dev.jsx') : path.join(__dirname, 'client/entry.prod.jsx')
			'babel-polyfill',
			path.join(__dirname, 'client/entry.dev.jsx')
		],
	},
	output: {
		publicPath: './',
		path:  path.join(__dirname, `${process.env.NODE_ENV !== 'production' ? 'dll/' : 'dist/'}`), //文件输出目录
		filename: 'core/[name].[hash:5].js', //根据入口文件输出的对应多个文件名
		chunkFilename: 'core/[name].[chunkhash:5].js'
	},

	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, 'app')
		],
		// modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
		extensions: ['.json', '.jsx', '.web.js', '.js',],
		alias: {
			app: path.resolve(__dirname, 'app'),
			view: path.resolve(__dirname, 'app/view'),
			components: path.resolve(__dirname, 'app/components'),
			assets: path.resolve(__dirname, 'assets'),
			images: path.resolve(__dirname, 'assets/images'),
			utils: path.resolve(__dirname, 'app/utils'),
			service:path.resolve(__dirname, 'app/service'),
		},
	},

	module: {
		rules: [
			{
				test: /\.(eot|JPEG|woff|woff2|ttf|svg|png|jpe?g|gif|mp4|webm)(\?\S*)?$/,
				// exclude: /node_modules/,
				// include: [
				// 	path.resolve(__dirname, 'app'),
				// 	path.resolve(__dirname, 'clinet')
				// ],
				loader: 'url-loader?limit=200&name=img/[name].[hash:5].[ext]',
				// use: [{

				// 	options: {
				// 		limit: 8192
				// 	}
				// }],
			},
			{
				test: /\.(js|jsx)$/,
				use: ['babel-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.(svg)$/i,
				loader: 'svg-sprite-loader',
				include: svgDirs,

			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new CopyWebpackPlugin([{
			from: path.join(__dirname, 'assets/iconfont'),
			to: path.join(__dirname, 'dist/iconfont'),
		}]),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, `${process.env.NODE_ENV !== 'production' ? 'dll' : 'app'}/index.html`),
			// template: path.join(__dirname, `${process.env.NODE_ENV !== 'production' ? 'app' : 'app'}/index.html`),
			inject: true,
		}),
	],
};

if (process.env.NODE_ENV !== 'production') {
	webpackConfig.devtool = 'cheap-module-eval-source-map';
	webpackConfig.entry.fongwell = [
		'webpack/hot/dev-server',
		'webpack-dev-server/client?http://0.0.0.0:8080',
		...webpackConfig.entry.fongwell
	];
	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
	webpackConfig.plugins.push(new webpack.DllReferencePlugin({
		context: __dirname,
		manifest: path.join(__dirname, 'dll/manifest.json'),
	}));
	webpackConfig.module.rules = [
		...webpackConfig.module.rules,
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader', 'postcss-loader']
		},
		{
			test: /\.global.scss$/,
			use: [
				'style-loader',
				'css-loader',
				'resolve-url-loader',
				'postcss-loader',
				{
					loader: 'sass-loader',
					options: {
						includePaths: [
							path.resolve(__dirname, 'assets/styles'),
						],
					}
				},
			],
		},
		{
			test: /\.scss$/,
			exclude: /\.global.scss$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: true,
						sourceMap: true,
						importLoaders: 1,
						localIdentName: '[name]-[local]__[hash:base64:5]'
					}
				},
				'resolve-url-loader',
				'postcss-loader',
				{
					loader: 'sass-loader',
					options: {
						includePaths: [
							path.resolve(__dirname, 'assets/styles'),
						],
					}
				},
			],
		},
		{
			test: /\.(less)$/,
			use: [
				'style-loader',
				'css-loader',
				{ loader: 'less-loader', options: { modifyVars: pkg.theme } },
			],
		},
	];
} else {
	webpackConfig.plugins.push(new ExtractTextPlugin('styles.css'));
	webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
		output: {
			comments: false,
		},
		compress: {
			warnings: false
		}
	}));
	// webpackConfig.output.publicPath='/assets/';
	webpackConfig.module.rules = [

		...webpackConfig.module.rules,

		{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [
					{
						loader: 'css-loader',
						options: {
							minimize: true,
						}
					},
					'postcss-loader'
				]
			})
		},
		{
			test: /\.global.scss$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [
					{
						loader: 'css-loader',
						options: {
							minimize: true,
						}
					},
					'resolve-url-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							includePaths: [
								path.resolve(__dirname, 'assets/styles')
							],
						}
					}
				],
			}),
		},
		// module css
		{
			test: /\.(sass|scss)$/,
			exclude: /\.global.scss$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [
					{
						loader: 'css-loader',
						options: {
							minimize: true,
							modules: true,
							importLoaders: 1,
							localIdentName: '[name]-[local]__[hash:base64:5]'
						}
					},
					'resolve-url-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							includePaths: [
								path.resolve(__dirname, 'assets/styles')
							],
						}
					}
				],
			}),
		},
		{
			test: /\.(less)$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [
					{
						loader: 'css-loader',
						options: {
							minimize: true
						}
					},
					{ loader: 'less-loader', options: { modifyVars: pkg.theme } },
				],
			}),
		}];
}

export default webpackConfig;
