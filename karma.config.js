const webpackConfig = require("./webpack.config");

module.exports = function (config) {
    config.set({
        frameworks: ['mocha','chai'],
        files: [
            { pattern: 'https://cdn.jsdelivr.net/gh/aframevr/aframe@cb4de2e19d577e9b5c34f01efe1c1d96c1d1c2e0/dist/aframe-master.min.js', watched: false},
            { pattern: 'test/browser/**/*.ts', watched: true },
            { pattern: 'test/common/**/*.ts', watched: true }
        ],
        preprocessors: {
            'test/browser/**/*.ts': [ 'webpack' ],
            'test/common/**/*.ts': [ 'webpack' ]
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
            externals: webpackConfig.externals
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless', 'FirefoxHeadless'],
        autoWatch: true,
        singleRun: false,
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless'],
            },
        },
    })
}