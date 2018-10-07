const webpackConfig = require("./webpack.config");

module.exports = (config) => {
    config.set({
        frameworks: ['mocha','chai'],
        files: [
            { pattern: 'test/browser/**/*.ts', watched: false },
            { pattern: 'test/common/**/*.ts', watched: false }
        ],
        preprocessors: {
            'test/browser/**/*.ts': [ 'webpack' ],
            'test/common/**/*.ts': [ 'webpack' ]
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless', 'FirefoxHeadless'],
        autoWatch: false,
        singleRun: true,
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless'],
            },
        },
    })
}