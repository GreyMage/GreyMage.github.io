var webpack = require('webpack');

module.exports = {
    entry: "./src/entry.js",
    output: {
        path: __dirname+'/build/',
        filename: "bundle.js"
    },
	plugins: [
		// Minify Output
		new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
	],
    module: {
        loaders: [
			// CSS
            { test: /\.css$/, loader: "style!css" },
			// ES6
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel', // 'babel-loader' is also a legal name to reference
				query: {
					presets: ['es2015']
				}
			},
			// LESS
			{
				test: /\.less$/,
				loader: "style!css!less"
			},
			// Sprites
			{ test: /\.png$/, loader: "url-loader" },
        ]
    }
};