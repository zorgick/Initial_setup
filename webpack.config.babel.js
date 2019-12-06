// @ts-nocheck
const PATH = require('path')
const cp = require('child_process')

const webpack = require('webpack')
const url = require('postcss-url')
const cssPresetEnv = require('postcss-preset-env')
const atImport = require('postcss-import')
const flexbugs = require('postcss-flexbugs-fixes')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const commit = cp
  .execSync('git rev-parse HEAD')
  .toString()
  .trim()
const version = cp
  .execSync('git describe --abbrev=0 --tags')
  .toString()
  .trim()

const { DEBUG_BUNDLE, NODE_ENV } = process.env
const PROJECT = 'initial-setup'

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
    runtimeChunk: false,
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
                cssPresetEnv,
                cssnano,
                flexbugs
              ]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            }
          },
          'svgo-loader'
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
        NODE_ENV: JSON.stringify(NODE_ENV),
        COMMIT: JSON.stringify(commit),
        VERSION: JSON.stringify(version)
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: PROJECT,
      chunks: ['runtime~app', 'vendors', 'app']
    }),
    NODE_ENV === 'production' && new CleanWebpackPlugin(),
    DEBUG_BUNDLE && new BundleAnalyzerPlugin()
  ].filter(Boolean),
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
