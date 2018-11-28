const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    context: __dirname,
    entry: ['./src/scripts/app.js', './src/styles/main.scss'],
    devtool: isProd ? false : 'source-map',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'scripts/app.js'
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.m?js$/,
          exclude: /node_modules/,
          loader: 'prettier-loader',
          options: {
            parser: 'babylon'
          }
        },
        {
          enforce: "pre",
          test: /\.m?js$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader', options: { sourceMap: !isProd } },
            { loader: 'postcss-loader', options: { sourceMap: !isProd } },
            { loader: 'sass-loader', options: { sourceMap: !isProd } }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist/*.*']),
      new CopyWebpackPlugin([
        { from: 'src/images/', to: 'images/' },
        { from: 'src/fonts/', to: 'fonts/' }
      ]),
      new MiniCssExtractPlugin({ filename: 'styles/main.css' }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),
    ]
  };
};
