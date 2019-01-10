const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
        rules: [ {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }, {
            test: /\.ts?$/,
            loader: "ts-loader"
        }
        ]
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
        host: "0.0.0.0",
        port: 3001,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
    mode: "production"
};