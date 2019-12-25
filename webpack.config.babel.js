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

const { DEBUG_BUNDLE, NODE_ENV } = process.env
const PROJECT = 'initial-setup'
const modulesCssPattern = /node_modules\/.*.css$/i

/**
 * Gets a string from the hash of the commit
 * Usage: mostly for browser caching of static resources
 */
const commit = cp
  .execSync('git rev-parse HEAD')
  .toString()
  .trim()

const version = cp
  .execSync('git describe --abbrev=0 --tags')
  .toString()
  .trim()

module.exports = {
  /**
   * Entry plugin
   */
  entry: {
    app: './src/browser/index'
  },
  /**
   * Output plugin
   */
  output: {
    filename: 'chunk.[name].js?[hash]',
    chunkFilename: 'chunk.[name].js?[chunkhash]',
    path: PATH.resolve(__dirname, 'dist'),
    publicPath: `/${PROJECT}/`
  },
  /**
   * Optimization plugin
   */
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
  /**
   * Module plugin
   */
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          PATH.resolve(__dirname, 'src/browser'),
          PATH.resolve(__dirname, 'src/shared')
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        /**
         * skip node_modules .css files
         */
        exclude: modulesCssPattern,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 0
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'by-ident',
              plugins: () => [
                atImport({
                  path: './src/shared'
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
        /**
         * load node_modules .css files without changing
         * their class names
         */
        test: modulesCssPattern, //
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'by-ident',
              plugins: () => [
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
  /**
   * Module resolution plugin
   */
  resolve: {
    modules: ['node_modules', PATH.resolve(__dirname, 'src')]
  },
  /**
   * Custom plugins
   */
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
      template: './src/browser/index.html',
      title: PROJECT,
      chunks: ['runtime~app', 'vendors', 'app']
    }),

    NODE_ENV === 'production' && new CleanWebpackPlugin(),

    DEBUG_BUNDLE && new BundleAnalyzerPlugin()
  ].filter(Boolean),
  /**
   * Source map plugin
   */
  ...(NODE_ENV === 'production' && {
    devtool: 'source-map'
  }),
  /**
   * devServer plugin
   */
  ...(NODE_ENV === 'development' && {
    devServer: {
      port: 3080,
      contentBase: PATH.resolve(__dirname, 'dist'),
      historyApiFallback: {
        rewrites: [
          {
            from: new RegExp(`^/${PROJECT}(/[a-z-/]+)?$`),
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
