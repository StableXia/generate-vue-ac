const path = require('path')
const config = require('../config')
const utilService = require('./util.service')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/index.js'
  },

  context: path.resolve(__dirname, '..'),

  output: {
    path: config.build.assetsRoot,
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.js',
      '@': resolve('src')
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utilService.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utilService.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utilService.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/'
              }
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/'
              }
            }
          },
          'css-loader'
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[id].css'
    })
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vender',
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
}
