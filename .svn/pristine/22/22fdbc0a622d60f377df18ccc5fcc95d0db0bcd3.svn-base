import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const webpackConfig = {
	entry: {
		// dyun: ['react', 'react-dom', ],
		dyun: [
			// 'babel-polyfill',
			'react',
			'react-dom',
			'react-router',
			'mobx-react',
			'moment',
			'mobx',
		],
	},

	output: {
		filename: '[name].[hash:5].dll.js',
		path: path.join(__dirname, 'dll'),
		library: '[name]'
	},

	plugins: [
		new webpack.DllPlugin({
			path: path.join(__dirname, 'dll/manifest.json'),
			name: '[name]',
			context: __dirname,
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'app/index.html'),
			inject: true,
		}),
	],
};

webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
	output: {
		comments: false,
	},
	compress: {
		warnings: false
	}
}));

if (process.env.NODE_ENV === 'production') {
	webpackConfig.plugins.push(new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV)
		}
	}));
}

export default webpackConfig;
