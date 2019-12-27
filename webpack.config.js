const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const JS_DIR = './public_src/javascripts';

module.exports = {
    entry: {
    // breed_common: path.resolve(JS_DIR, 'cs-breed-create.js'),
        breed_create: path.resolve(JS_DIR, 'cs-breed-create.js'),
        breed_list: path.resolve(JS_DIR, 'cs-breed-list.js'),
        breed_update: path.resolve(JS_DIR, 'cs-breed-update.js'),
        // cage_common: path.resolve(JS_DIR, 'cs-cage-common.js'),
        cage_create: path.resolve(JS_DIR, 'cs-cage-create.js'),
        cage_list: path.resolve(JS_DIR, 'cs-cage-list.js'),
        cage_update: path.resolve(JS_DIR, 'cs-cage-update.js'),
        // form_helper: path.resolve(JS_DIR, 'cs-form-helper.js'),
        // model_common: path.resolve(JS_DIR, 'cs-model-common.js'),
        mouse_create: path.resolve(JS_DIR, 'cs-mouse-create.js'),
        mouse_list: path.resolve(JS_DIR, 'cs-mouse-list.js'),
        mouse_update: path.resolve(JS_DIR, 'cs-mouse-update.js'),
        grid_list: path.resolve(JS_DIR, 'cs-grid-list.js'),
    },
    devtool: 'cheap-module-eval-source-map',
    // devServer: {
    //     contentBase: './dist'
    // },
    plugins: [
        new CleanWebpackPlugin(['public/javascripts']),
        // new HtmlWebpackPlugin({
        //     title: 'Output Management'
        // }),
        // new UglifyJSPlugin({
        //     uglifyOptions: {
        //         ie8: false,
        //         ecma: 6
        //     }
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common', // Specify the common bundle's name.
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new webpack.ProvidePlugin({
    //     $: "jquery",
    //     jQuery: "jquery",
    //     "window.jQuery": "jquery"
    // })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public', 'javascripts'),
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
                    presets: ['env'],
                    ignore: '/node_modules/',
                },
                
            },
        },
        ],
    },
};
