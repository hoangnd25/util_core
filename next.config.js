// jshint ignore: start
// .env for local development constants only
require('dotenv').config({ path: '.env', silent: true });
const useCDN = process.env.APP_ENV !== 'local' && process.env.APP_ENV !== 'test';
const webpack = require("webpack");
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const StatsPlugin = require("stats-webpack-plugin");


module.exports = {

  poweredByHeader: false,
  // CDN stuff https://www.npmjs.com/package/next#cdn-support-with-asset-prefix
  //assetPrefix: useCDN ? `https://cdn.go1static.com/assets/${process.env.DOCKER_TAG}` : '',
  // Sent env variables to frontend in page-builder
  publicRuntimeConfig: {
    DOCKER_TAG: process.env.DOCKER_TAG,
    API_ENDPOINT: process.env.API_ENDPOINT,
    APP_ENV: process.env.APP_ENV,
    LOGIN_REDIRECT_URL: '/user/login',
  },

  webpack: (config, options) => {
    // Include node_modules for babel transformation
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

    // Add plugins
    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.DefinePlugin({
      __DEV__: process.env.APP_ENV === 'local',
    }));
    config.plugins.push(new LodashModuleReplacementPlugin);

    // only create stats on local
    if(process.env.APP_ENV === 'local') {
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

    return config;
  }
};
