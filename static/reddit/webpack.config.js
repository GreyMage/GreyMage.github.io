require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: "./src/app.js", // string | object | array
  
  // Here the application starts executing
  // and webpack starts bundling

    output: {
        path: path.resolve(__dirname, "build"), // string
        filename: "app.js", // string
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    query:{
                        presets: ['env', 'react']
                    }
                }
            },
            {
                test: /\.less$/,
                use: [{
					loader: 'style-loader' // creates style nodes from JS strings
				}, {
					loader: 'css-loader' // translates CSS into CommonJS
				}, {
					loader: 'less-loader' // compiles Less to CSS
				}]
            },
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
            // compress: {
                // warnings: false,
                // screw_ie8: true,
                // conditionals: true,
                // unused: true,
                // comparisons: true,
                // sequences: true,
                // dead_code: true,
                // evaluate: true,
                // if_return: true,
                // join_vars: true
            // },
            // output: {
                // comments: false
            // }
        // }),
        // new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
}
