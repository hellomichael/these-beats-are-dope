let path = require('path')
let webpack = require('webpack')
let extractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: [
    'babel-polyfill',
    './js/App.js'
  ],
  output: {
    filename: 'App.js',
    path: path.join(__dirname, 'dist'),
    publicPath: false ? '../dist/' : '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader',
        query: {
            limit: 51200,
            name: 'images/[name].[ext]'
        }
      },
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
        loader: extractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader', 'sass-resources'])
      }
    ]
  },
  sassResources: ['./scss/_variables.scss', './scss/_mixins.scss', './scss/_placeholders.scss' ],
  postcss: function () {
    return [
      require('autoprefixer')
    ]
  },
  plugins: [
    new extractTextPlugin('App.css', {
      allChunks: true
    })
  ]
}
