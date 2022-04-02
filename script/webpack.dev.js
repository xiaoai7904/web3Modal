const path = require('path');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 8000,
    compress: true,
    contentBase: path.resolve(__dirname, "../dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../index.html"),
      filename: "index.html",
      chunksSortMode: "manual",
      chunks: ["app"],
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
