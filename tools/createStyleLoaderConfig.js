import { reScss } from './webpack.config';

// pageName = 'article' | !'article'
export const createStyleLoaders = pageName => {
  return [
    {
      issuer: { not: [reScss] },
      loader: 'isomorphic-style-loader',
    },
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: './tools/postcss.config.js',
        },
      },
    },
    {
      loader: 'sass-loader',
    },
  ];
};
