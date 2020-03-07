const webpack = require('webpack')

module.exports = [
  new webpack.DefinePlugin({
    'process.env.FLUENTFFMPEG_COV': false
  })
];
