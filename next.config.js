const path = require('path');
const useCDN = process.env.ENV !== 'local' && process.env.ENV !== 'test';
const webpack = require("webpack");
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const StatsPlugin = require("stats-webpack-plugin");

module.exports = {

  poweredByHeader: false,
  // CDN stuff https://www.npmjs.com/package/next#cdn-support-with-asset-prefix
  assetPrefix: useCDN ? `${process.env.CDN_PATH}/${process.env.DOCKER_TAG}` : '',
  crossOrigin: 'anonymous',
  // Sent env variables to frontend in page-builder
  publicRuntimeConfig: {
    DOCKER_TAG: process.env.DOCKER_TAG,
    API_URL: process.env.API_URL,
    ENV: process.env.ENV,
    LOGIN_REDIRECT_URL: process.env.ENV === 'local' ? '/r/app/portal' : '/user/login',
  },

  webpack: (config, options) => {
    // Include node_modules for babel transformation
    if (!options.isServer) {
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      });
    }

    // Add plugins
    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.DefinePlugin({
      __DEV__: process.env.ENV === 'local',
    }));
    config.plugins.push(new LodashModuleReplacementPlugin);

    // only create stats on local
    if(process.env.ENV === 'local') {
      config.profile = true;
      config.plugins.push(
        new StatsPlugin('stats.json', {
          timings: true,
          assets: true,
          chunks: true,
          chunkModules: true,
          modules: true,
          children: true,
          cached: true,
          reasons: true
        })
      );
    }

    // Add polyfill for node_modules
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js')
      }
      return entries;
    };

    config.module.rules.push({
      test: /\.po/,
      use: [
        {
          loader: '@lingui/loader',
        },
      ],
    });

    return config;
  }
};
