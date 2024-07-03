const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { DefinePlugin, CleanPlugin } = require('webpack');
const webpackTemplate = require('./webpack.template.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

require('./webpack.utils.js');

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gltf|patt|dat)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: './',
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              modules: {
                mode: 'local',
                exportGlobals: true,
                namedExport: true,
                exportLocalsConvention: 'as-is',
                exportOnlyLocals: false,
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|mp3)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  stats: 'errors-only',
  devServer: {
    static: './src',
    compress: true,
    port: 3000,
    hot: true,
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3001',
        pathRewrite: { '^/api': '/v1' },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    pathinfo: false,
    clean: true,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  plugins: [
    new DefinePlugin({
      NODE_ENV: JSON.stringify('production'),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      templateContent: webpackTemplate,
      hash: true,
    }),
    new CaseSensitivePathsPlugin(),
    new CopyPlugin({
      patterns: [{ from: 'public', to: 'public' }],
    }),
  ],
};
