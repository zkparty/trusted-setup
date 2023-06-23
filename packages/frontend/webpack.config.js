const HtmlWebpackPlugin = require('html-webpack-plugin')
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')

module.exports = (env, argv) => ({
  entry: ['./src/index.tsx'],
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '-',
    },
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json', '.tsx', '.ts'],
    fallback: {
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify/browser'),
      events: require.resolve('events/'),
      fs: false,
      readline: false,
      constants: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        // exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      inlineSource: '.(js|css)',
    }),
    new MiniCssExtractPlugin(),
    // new HtmlWebpackInlineSourcePlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: `'${argv.mode}'` ?? `'development'`,
      'process.env': {},
      'process.argv': [],
      'process.versions': {},
      'process.versions.node': '"12"',
      process: {
        exit: '(() => {})',
        browser: true,
        versions: {},
        cwd: '(() => "")',
      },
    }),
    new webpack.ProvidePlugin({
      Buffer: path.resolve(__dirname, 'externals', 'buffer.js'),
    }),
    new webpack.ContextReplacementPlugin(/\/maci\-crypto\//, (data) => {
      delete data.dependencies[0].critical
      return data
    }),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
})
