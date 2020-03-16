const webpack = require('webpack')
const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FLUENTFFMPEG_COV': false,
    })
  ],
  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom' },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
