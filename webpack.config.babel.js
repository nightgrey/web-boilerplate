import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

export default function(isDevelopement = true) {
  const pluginConfiguration = {
    htmlWebpackPlugin: {
      pageTitlePrefix: 'web-boilerplate',
      pageTitleSeperator: '|',
      minify: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhiteSpace: true,
        conservativeCollapse: true,
        collapseInlineTagWhitespace: true,
        preserveLineBreaks: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        preventAttributesEscaping: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeOptionalTags: true,
        removeEmptyElements: true,
        keepClosingSlash: true
      }
    }
  };

  let htmlMinifierOptions = {

  };

  const webpackConfiguration = {
    context: __dirname + '/src',
    entry: [
      './components/index.js'
    ],
    output: {
      path: __dirname + '/dist',
      filename: 'main.js',
      publicPath: '/',
      sourceMapFileName: '[file].map'
    },
    devtool: isDevelopement ? 'cheap-source-map' : 'source-map',
    module: {
      loaders: [
        {
          loader: 'url-loader?limit=10000!img?optimizationLevel=5',
          test: /\.(gif|jpg|png|svg)$/
        },
        {
          loader: 'url-loader?limit=1',
          test: /favicon\.ico$/
        },
        {
          loader: 'url-loader?limit=100000',
          test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/
        },
        {
          test: /\.ejs$/,
          loader: 'embeddedjs-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader!eslint-loader',
          exclude: '/node_modules/'
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style-loader", 'css-loader?sourceMap' + '!autoprefixer-loader?browsers=last 2 version' + '!sass-loader?outputStyle=expanded&sourceMap&sourceMapContents')
        }
      ]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        }
      }),
      new ExtractTextPlugin('main.css', {
        allChunks: true
      }),
      new HtmlWebpackPlugin({
        title: 'Index',
        hash: true,
        inject: true,
        template: 'templates/index.ejs',
        minify: pluginConfiguration.htmlWebpackPlugin.minify,
      }),
      new HtmlWebpackPlugin({
        title: 'Content',
        hash: true,
        inject: true,
        filename: 'content.html',
        template: 'templates/content.ejs',
        minify: pluginConfiguration.htmlWebpackPlugin.minify
      }),
      new CopyWebpackPlugin([
        { from: '*.*' }
      ])
    ]
  };


  /**
   * Developement
   */
  if(isDevelopement) {
    webpackConfiguration.entry.push(
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack/hot/dev-server'
    );

    webpackConfiguration.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: webpackConfiguration.webpack.browserSyncPort,
        proxy: 'http://localhost:8080/'
      }, {
        reload: false
      })
    );
  }


  /**
   * Production
   */
  if(!isDevelopement) {
    webpackConfiguration.plugins.push(
      new webpack.optimize.DedupePlugin()
    );
  }

  return webpackConfiguration;
};
