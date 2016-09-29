let path = require('path');
let extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './js/app.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test:     /\.js$/,
        include: path.join(__dirname, 'js'),
        exclude: /node_modules/,
        loader:  'babel'
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'scss'),
        exclude: /node_modules/,
        loader: extractTextPlugin.extract('style-loader', ['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [
    new extractTextPlugin('app.css', {
      allChunks: true
    })
  ]
}
