/* global require module */

const context = require.context('./src', true, /\.test\.jsx?$/);

context.keys().forEach(context);

module.exports = context;
