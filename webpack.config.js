const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

// const CONTROLLER_JS_DIR = './src/controllers';
// const ROUTES_JS_DIR = './src/routes';
const JS_DIR = './public_src/javascripts';
const THIRD_PARTY_DIR = './public_src/third-party';
const STYLESHEETS_DIR = './public_src/stylesheets';
const MODELS_DIR = './src/database/models/'
const ROUTES_DIR = './src/routes/'
const PUBLIC_DIR = './public';
const MODE = 'development';
const x = nodeExternals();
console.log(`nodeExternals: ${x}`);

module.exports = [
  {
    mode: MODE,
    watch: true,
    entry: {
      breed_create: path.resolve(JS_DIR, 'cs-breed-create.js'),
      breed_list: path.resolve(JS_DIR, 'cs-breed-list.js'),
      breed_update: path.resolve(JS_DIR, 'cs-breed-update.js'),
      cage_create: path.resolve(JS_DIR, 'cs-cage-create.js'),
      cage_list: path.resolve(JS_DIR, 'cs-cage-list.js'),
      cage_update: path.resolve(JS_DIR, 'cs-cage-update.js'),
      mouse_create: path.resolve(JS_DIR, 'cs-mouse-create.js'),
      mouse_list: path.resolve(JS_DIR, 'cs-mouse-list.js'),
      mouse_update: path.resolve(JS_DIR, 'cs-mouse-update.js'),
      grid_list: path.resolve(JS_DIR, 'cs-grid-list.js'),
      project_list: path.resolve(JS_DIR, 'cs-project-list.js'),
    },
    devtool: 'cheap-module-eval-source-map',
    // devServer: {
    //     contentBase: './dist'
    // },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 3,
            name: 'common',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      // new CleanWebpackPlugin(),
      // new HtmlWebpackPlugin({
      //     title: 'Output Management'
      // }),
      // new UglifyJSPlugin({
      //     uglifyOptions: {
      //         ie8: false,
      //         ecma: 6
      //     }
      // }),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // new webpack.ProvidePlugin({
      //     $: "jquery",
      //     jQuery: "jquery",
      //     "window.jQuery": "jquery"
      // })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, PUBLIC_DIR, 'javascripts'),
      publicPath: '/',
    },
    externals: {
      jquery: 'jQuery',
      selectize: '',
    },

    resolveLoader: {
      modules: ['node_modules'],
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main'],
    },


    module: {
      rules: [{
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader',
        ],
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader',
        ],
      },
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: '$',
        }],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            ignore: ['/node_modules/'],
          },

        },
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },

        ],
      },
      ],
    },
  },

  {
    mode: MODE,
    entry: {
      server: './src/index.ts',
      "database/models/index": path.resolve(MODELS_DIR, 'index.js'),
      "database/models/project": path.resolve(MODELS_DIR, 'project.js'),
      "database/models/experiment": path.resolve(MODELS_DIR, 'experiment.js'),
      "database/models/project_experiment": path.resolve(MODELS_DIR, 'project_experiment.js'),

    },
    watch: true,
    devtool: 'inline-source-map',
    externals: [nodeExternals()],
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.ts$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },

          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new CleanWebpackPlugin(),
      
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs',
    },
  }];