const url = require('postcss-url')
const cssPresetEnv = require('postcss-preset-env')
const flexbugs = require('postcss-flexbugs-fixes')
const cssnano = require('cssnano')
const atImport = require('postcss-import')

const { NODE_ENV } = process.env

const cssRegex = /\.css$/
const cssModuleRegex = /node_modules\/.*.css$/

const htmlLoader = {
  test: /\.html$/,
  loader: 'html-loader',
  options: {
    removeComments: false,
    removeAttributeQuotes: false
  }
}

const babelLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    cacheCompression: NODE_ENV === 'production',
    compact: NODE_ENV === 'production'
  }
}

const cssModuleLoader = {
  /**
   * load node_modules .css files without changing
   * their class names
   */
  test: cssModuleRegex,
  use: [
    'isomorphic-style-loader',
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
}

const cssLoader = { ...cssModuleLoader }
cssLoader.test = cssRegex
//@ts-ignore
cssLoader.exclude = cssModuleRegex
//@ts-ignore
cssLoader.use[1].options.modules = true

const fileLoaderClient = {
  test: /\.svg$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'assets/[name].[hash:8].[ext]'
      }
    },
    'svgo-loader'
  ]
}

const fileLoaderServer = { ...fileLoaderClient }
//@ts-ignore
fileLoaderServer.use[0].options.emitFile = false

const client = [
  {
    oneOf: [
      htmlLoader,
      babelLoader,
      cssModuleLoader,
      cssLoader,
      fileLoaderClient
    ]
  }
]

const server = [
  {
    oneOf: [babelLoader, cssModuleLoader, cssLoader, fileLoaderServer]
  }
]

module.exports = { client, server }
