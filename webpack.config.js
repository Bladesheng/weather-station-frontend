/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: "./src/pages/index.tsx",
    sw: "./src/workers/sw.ts",
  },
  devServer: {
    static: "./dist",
    port: 8000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/pages/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "./src/assets/images/", to: "./images" }],
    }),
    new webpack.DefinePlugin({
      BUILD_NUMBER: JSON.stringify(Date.now()), // for generating new name of cache on build
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", "..."],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|webmanifest)$/i,
        type: "asset/resource",
        generator: {
          // put all generated assets into "dist/"
          filename: "[name][ext]",
        },
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  experiments: {
    topLevelAwait: true,
  },
};
