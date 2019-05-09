const { createBabelConfig } = require('./tools/createBabelConfig');

const babelConfig = createBabelConfig({ configMode: 'server', env: process.env.NODE_ENV });

module.exports = babelConfig;
