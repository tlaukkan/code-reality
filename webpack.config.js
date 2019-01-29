var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/browser/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [ '.ts', ".js", ".json"]
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/(node_modules)/,/(dist)/,/(lib)/],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }, {
            test: /\.ts?$/,
            loader: "ts-loader",
            exclude: [/(node_modules)/,/(dist)/,/(lib)/]
        }]
    },
    devtool: 'eval-source-map',
    externals: {
        three: 'THREE'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'static' }
        ]),
        new webpack.IgnorePlugin(/wrtc/),
        new webpack.IgnorePlugin(/console-stamp/),
        new webpack.IgnorePlugin(/websocket/)
    ],
    devServer: {
        compress: true,
        host: "localhost",
        port: 3001,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
    mode: "production"
};