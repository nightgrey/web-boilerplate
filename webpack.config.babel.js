import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import webpack from 'webpack';

export default function(isDevelopment = true) {
  /**
   * Templates
   * Define the templates you want to compile to HTML
   */
  const templates = [
    {
      title: 'Home',
      template: 'index.ejs',
      output: 'index.html'
    },
    {
      title: 'Standard page',
      template: 'standard.ejs',
      output: 'standard.html'
    }
  ];


  /**
   * Repeating plugin configuration
   */
  const pluginConfiguration = {
    htmlWebpackPlugin: {
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
      },
      /** Custom data */
      pageTitle: 'web-boilerplate',
      pageTitleSeperator: '|',
      themeColor: '#555555'
    }
  };


  /**
   * Webpack configuration
   */
  return {
    context: __dirname + '/src',
    entry: isDevelopment ? [
      './components/index.js',
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack/hot/dev-server'
    ] : [
      './components/index.js'
    ],
    output: {
      path: __dirname + '/dist',
      filename: 'main.js',
      publicPath: '/',
      sourceMapFileName: '[file].map',
      devtoolModuleFilenameTemplate: "sources/[resourcePath]?[hash]"
    },
    devtool: isDevelopment ? 'cheap-module-eval-source-map' : 'source-map',
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
          loader: ExtractTextPlugin.extract("style-loader", 'css-loader!postcss-loader!sass-loader')
        }
      ]
    },
    plugins: (() => {
      let plugins = [
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
        new CopyWebpackPlugin([
          { from: '*.*' }
        ])
      ];


      /**
       * General
       */
      templates.forEach((element) => {
        plugins.push(
          new HtmlWebpackPlugin({
            title: element.title,
            hash: true,
            inject: true,
            template: `templates/${element.template}`,
            filename: `${element.output}`,
            minify: pluginConfiguration.htmlWebpackPlugin.minify,
            pageTitle: pluginConfiguration.htmlWebpackPlugin.pageTitle,
            pageTitleSeperator: pluginConfiguration.htmlWebpackPlugin.pageTitleSeperator,
            themeColor: pluginConfiguration.htmlWebpackPlugin.themeColor
          })
        );
      });


      /**
       * Development only
       */
      if(isDevelopment) {
        plugins.push(
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin(),
          new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            proxy: 'http://localhost:8080/'
          }, {
            reload: false
          })
        );
      }

      /**
       * Production
       */
      if(!isDevelopment) {
        plugins.push(
          new webpack.optimize.DedupePlugin()
        );
      }

      return plugins;
    })(),
    postcss: () => [
      autoprefixer({ browsers: 'last 2 version' }),
      cssnano()
    ]
  };
};
