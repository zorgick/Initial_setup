// @ts-nocheck
import url from 'postcss-url'
import cssPresetEnv from 'postcss-preset-env'
// import atImport from 'postcss-import'
import flexbugs from 'postcss-flexbugs-fixes'
import cssnano from 'cssnano'

const { NODE_ENV } = process.env

const cssRegex = /\.css$/
// const cssModuleRegex = /\.module\.css$/;
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
cssLoader.exclude = cssModuleRegex
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
fileLoaderServer.use[0].options.emitFile = false

export const client = [
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

export const server = [
  {
    oneOf: [babelLoader, cssModuleLoader, cssLoader, fileLoaderServer]
  }
]

export default { client, server }
