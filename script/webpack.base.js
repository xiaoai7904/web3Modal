const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const dev = require("./webpack.dev");
const prod = require("./webpack.prod");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = (env) => {
  const isDev = process.env.APP_ENV === "development"
  const baseConfig = {
    entry: {
      app: "./src/index.js",
    },
    output: {
      library: "web3Modal",
      libraryTarget: "umd",
      libraryExport: "default",
      filename: `js/web3Modal.js`,
      path: path.resolve(__dirname, "../dist"),
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: "vue-loader",
        },
        {
          test: /\.(js|jsx)$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(less|css)$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.svg/,
          use: {
            loader: "svg-url-loader",
            options: {
              iesafe: true,
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|eot|ttf|woff|woff2)\w*/,
          loader: "url-loader?limit=1000000",
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          APP_ENV: `"${process.env.APP_ENV}"`,
        },
      }),
    ],
  };

  if (env.development) {
    return merge(baseConfig, dev);
  }
  return merge(baseConfig, prod);
};
