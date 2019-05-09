function createBabelConfig({ configMode, env }) {
  const isConfigModeClient = configMode === 'client';
  const isConfigModeServer = configMode === 'server';
  const isEnvProd = env === 'production';

  return {
    presets: [
      isConfigModeServer && [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
      isConfigModeClient && [
        '@babel/preset-env',
        {
          targets: {
            ie: 9,
          },
          ignoreBrowserslistConfig: true,
          useBuiltIns: false,
          modules: false,
          exclude: ['transform-typeof-symbol'],
        },
      ],
      [
        '@babel/preset-react',
        {
          useBuiltIns: true,
        },
      ],
      '@babel/preset-typescript',
    ].filter(Boolean),
    plugins: [
      isEnvProd && ['babel-plugin-transform-react-remove-prop-types', { removeImport: true }],
      isConfigModeServer && 'babel-plugin-dynamic-import-node',
      '@babel/plugin-transform-destructuring',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: false,
          absoluteRuntime: true,
        },
      ],
      '@babel/plugin-syntax-dynamic-import',
    ].filter(Boolean),
  };
}

module.exports = { createBabelConfig };
