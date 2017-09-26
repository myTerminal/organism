/* global require module */

const WebpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = WebpackMerge(commonConfig, {
    plugins: [
        new UglifyJSPlugin()
    ]
});
