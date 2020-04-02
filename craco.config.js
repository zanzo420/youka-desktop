const webpack = require("webpack");

module.exports = {
  webpack: {
    node: undefined,
    configure: {
      target: "electron-renderer"
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.FLUENTFFMPEG_COV": false
      })
    ]
  }
};
