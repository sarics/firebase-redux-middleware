const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'firebase-redux-middleware.js',
    library: 'firebaseReduxMiddleware',
    libraryTarget: 'umd',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: !isProduction,
          },
        },
      },
    ],
  },
};
