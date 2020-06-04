const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    'JSDoX': ['./src/index.js'],
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    filename: '[name].js',
    //path: path.resolve(__dirname, './'),
  },
  module: { 
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
                sourceMap: true
            }
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader', 
            options: {
              sourceMap: true,
            }
          },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: 'head',
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: './src/html/', 
          to: './html' 
        },
      ]
    }),
  ]
};
