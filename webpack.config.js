const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

const CS_JS_DIR = './src/public/javascripts';
const CONTROLLER_JS_DIR = './src/controllers';
const DATABASE_JS_DIR = './src/database/models';

module.exports = {
    mode: 'none',

    entry: {
        // breed_common: path.resolve(JS_DIR, 'cs-breed-create.js'),
        'public/breed_create': path.resolve(CS_JS_DIR, 'cs-breed-create.js'),
        'public/breed_list': path.resolve(CS_JS_DIR, 'cs-breed-list.js'),
        'public/breed_update': path.resolve(CS_JS_DIR, 'cs-breed-update.js'),
        // 'public/cage_common': path.resolve(JS_DIR, 'cs-cage-common.js'),
        'public/cage_create': path.resolve(CS_JS_DIR, 'cs-cage-create.js'),
        'public/cage_list': path.resolve(CS_JS_DIR, 'cs-cage-list.js'),
        'public/cage_update': path.resolve(CS_JS_DIR, 'cs-cage-update.js'),
        // 'public/form_helper': path.resolve(JS_DIR, 'cs-form-helper.js'),
        // 'public/model_common': path.resolve(JS_DIR, 'cs-model-common.js'),
        'public/mouse_create': path.resolve(CS_JS_DIR, 'cs-mouse-create.js'),
        'public/mouse_list': path.resolve(CS_JS_DIR, 'cs-mouse-list.js'),
        'public/mouse_update': path.resolve(CS_JS_DIR, 'cs-mouse-update.js'),

        'controllers/mouse_controller': path.resolve(CONTROLLER_JS_DIR, 'mouse_controller.ts'),
        'controllers/base_controller': path.resolve(CONTROLLER_JS_DIR, 'base_controller.ts'),
        'controllers/utils_controller': path.resolve(CONTROLLER_JS_DIR, 'utils_controller.ts'),
        
        
    },
    devtool: 'cheap-module-eval-source-map',
    // devServer: {
    //     contentBase: './dist'
    // },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'public/common',
                    chunks: 'all',
                },
            },
        },
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
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
        // new CompressionPlugin({
        //     filename: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: /\.js$|\.css$|\.html$/,
        //     exclude: /\.ts$/,
        //     threshold: 10240,
        //     minRatio: 0.8,
        // }),
        // new BrotliPlugin({
        //     asset: '[path].br[query]',
        //     test: /\.js$|\.css$|\.html$/,
        //     exclude: /\.ts$/,
        //     threshold: 10240,
        //     minRatio: 0.8,
        // }),
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    externals: {
        jquery: 'jQuery',
        selectize: '',
    },

    // resolveLoader: {
    //     modules: ['node_modules'],
    //     extensions: ['.js', '.json'],
    //     mainFields: ['loader', 'main'],
    // },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
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
};
