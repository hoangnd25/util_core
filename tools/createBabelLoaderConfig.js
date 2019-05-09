const path = require('path');

const { createBabelConfig } = require('./createBabelConfig');

const rootThen = (p = '') => path.resolve(__dirname, '..', p);

function createBabelLoaderConfig({ configMode, env }) {
  const isEnvProd = env === 'production';
  const shouldCacheDirectory = isEnvProd === false;

  return {
    test: /\.(js|jsx|mjs|ts|tsx)$/,
    include: [rootThen('src'), rootThen('tools')],
    loader: 'babel-loader',
    options: {
      cacheDirectory: shouldCacheDirectory,
      ...createBabelConfig({ configMode, env }),
    },
  };
}

module.exports = { createBabelLoaderConfig };
