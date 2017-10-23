const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const path = require("path");

const extractSass = new ExtractTextPlugin({
  filename: "css/index.css",
  disable: process.env.NODE_ENV === "development"
});

const copyFiles = new CopyWebpackPlugin([
  {
    from: './src/img/',
    to: 'img/'
  }
]);

const cleanUp = new WebpackCleanupPlugin({
  preview: true,
});

const html = new HtmlWebpackPlugin({
  title: 'Project Demo',
  // minify: {
  //     collapseWhitespace: true
  // },
  hash: true,
  template: './src/index.html'
})

const imageMin = new ImageminPlugin({
  disable: process.env.NODE_ENV !== 'production', // Disable during development
  pngquant: {
    quality: '95-100'
  },
  test: /\.(jpe?g|png|gif|svg)$/i
})

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'js/app.bundle.js',
    sourceMapFilename: '[file].map'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.scss$/,
        exclude: /node_modules(?!\/webpack-dev-server)/,
        use: 
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: true
                }
              }, 
              {
                loader: 'sass-loader'
              }
            ]
          })
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    stats: "errors-only",
    open: true,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
  plugins: [
    cleanUp,
    html,
    copyFiles,
    extractSass,
    imageMin
    // uglifyJS
  ]
}