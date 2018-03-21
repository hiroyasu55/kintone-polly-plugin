const path = require('path')
const manifest = require('./src/manifest.json')
require('dotenv').config()

const types = ['desktop', 'mobile', 'config']
const entries = {}
types.forEach(type => {
  if (!manifest[type]) return
  if (manifest[type].js) {
    manifest[type].js.forEach(file => {
      if (file.match(/^(http|https):/)) return
      const entryName = file.replace(/\.js$/, '')
      entries[entryName] = [
        // 'babel-polyfill',
        './' + file
      ]
    })
  }
})

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  context: path.resolve(__dirname, './src'),
  entry: entries,
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: path.resolve(__dirname, './node_modules/kintone-utility/docs/kintoneUtility'),
        loader: 'exports-loader?kintoneUtility',
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  }
}
