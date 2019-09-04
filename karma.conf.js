/* global require module */

const webpackConfig = require('./webpack.common.js');
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        plugins: [
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-chai-plugins',
            'karma-webpack',
            'karma-sourcemap-loader'
        ],
        files: [
            'tests.bundle.js'
        ],
        exclude: [
        ],
        preprocessors: {
            'tests.bundle.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    });
};
