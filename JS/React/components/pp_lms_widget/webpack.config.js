var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
	entry: APP_DIR + '/index.js',
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js'
	},
	module:{
		rules: [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader'
			}
		]
	},
	plugins: [
		// new webpack.optimize.UglifyJsPlugin({minimize: true})
	]
};

module.exports = config;