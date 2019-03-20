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
        rules: [
            {
                test: /\.html$/,
                use: 'raw-loader',
            },
            {
                test: /\.js$/,
                exclude: [/(node_modules)/,/(node)/,/(lib)/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["transform-html-import-to-string"]
                    }
                }
            },
            {
                test: /\.ts?$/,
                exclude: [/(node_modules)/,/(node)/,/(lib)/],
                loader: "ts-loader"
            }
        ]
    },
    devtool: 'eval-source-map',
    externals: {
        three: 'THREE',
        aframe: 'AFRAME'
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
    mode: "development"
};