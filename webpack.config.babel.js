const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('postcss-url')
const cssPresetEnv = require('postcss-preset-env')
const atImport = require('postcss-import')

const PATH = require('path')

const { NODE_ENV } = process.env
const PROJECT = 'shoppingCart'

module.exports = {
  entry: {
    app: './src/index'
  },
  output: {
    filename: 'chunk.[name].js?[hash]',
    chunkFilename: 'chunk.[name].js?[chunkhash]',
    path: PATH.resolve(__dirname, 'dist'),
    publicPath: `/${PROJECT}/`
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: PATH.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'by-ident',
              plugins: () => [
                atImport({
                  path: './src'
                }),
                url({
                  url: 'inline'
                }),
                cssPresetEnv
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          removeComments: false,
          removeAttributeQuotes: false
        }
      }
    ]
  },
  resolve: {
    modules: ['node_modules', PATH.resolve(__dirname, 'src')]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV)
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: PROJECT,
      chunks: ['runtime~app', 'vendors', 'app']
    })
  ],
  ...(NODE_ENV === 'production' && {
    devtool: 'source-map'
  }),
  ...(NODE_ENV === 'development' && {
    devServer: {
      port: 3080,
      historyApiFallback: {
        rewrites: [
          {
            from: /^\/$/,
            to: `/${PROJECT}/index.html`
          }
        ]
      },
      stats: {
        colors: true
      }
    }
  })
}
