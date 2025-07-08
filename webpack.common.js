const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

require('dotenv').config({
  path: path.resolve('.env'),
});

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.WHATSAPP_PHONE_NUMBER': JSON.stringify(
        process.env.WHATSAPP_PHONE_NUMBER
      ),
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
      'process.env.ALLOWED_ADMIN_EMAILS': JSON.stringify(
        process.env.ALLOWED_ADMIN_EMAILS
      ),
      // 'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    }),
  ],
};
