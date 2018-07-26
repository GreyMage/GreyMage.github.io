const path = require('path');

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
                test: /\.ttf$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: path.resolve(__dirname, "public", "fonts")
                    }
                }
            },
        ]
    }
}
