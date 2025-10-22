module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            app: './src/app',
            features: './src/features',
            core: './src/core',
            services: './src/services'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
