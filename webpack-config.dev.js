'use strict';

var webpack = require('webpack'),
    path = require('path');

console.log(path.join(__dirname, 'build'));

module.exports = {
        name: 'TreeView',
        version: '0.0.1',
        description : 'TreeView test',

        output: {
            filename: 'main.js',
            path: path.join(__dirname, 'build'),
            publicPath: '/resources/'
        },

        cache: true,
        debug: true,
        devtool: false,

        entry: [

            // For hot style updates
            'webpack/hot/dev-server',

            // The script refreshing the browser on none hot updates
            'webpack-dev-server/client?http://localhost:8080',

            path.join(__dirname, 'app/index.jsx')
        ],

        stats: {
            colors: true,
            reasons: true
        },

        resolve: {
            extensions: ["", ".js", ".jsx"]
        },

        module: {
            loaders: [
                {
                    test: /\.jsx/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        // https://github.com/babel/babel-loader#options
                        cacheDirectory: true,
                        presets: ['es2015', 'react']
                    }
                },
                {
                    test: /\.js/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        // https://github.com/babel/babel-loader#options
                        cacheDirectory: true,
                        presets: ['es2015', 'react']
                    }
                },
                {
                    test: /\.less/,
                    loader: 'style-loader!css-loader!less-loader'
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                }, {
                    test: /\.(png|jpg)$/,
                    loader: 'url-loader?limit=8192'
                },
                {
                    test: /(?!fontawesome)\.(png|woff|woff2|eot|ttf|svg)$/,
                    loader: 'url-loader?limit=100000'
                },
                {   // font awesome fonts
                    test: /(?=.*fontawesome).*(?=.*\.woff(2))?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader?limit=10000&minetype=application/font-woff'
                },
                {   // font awesome fonts
                    test: /(?=.*fontawesome).*\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader'
                }
            ]
        },

        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ]
    }
