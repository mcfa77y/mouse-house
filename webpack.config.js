const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const webpack = require('webpack');
const fs = require('fs');
// const CONTROLLER_JS_DIR = './src/controllers';
// const ROUTES_JS_DIR = './src/routes';
const JS_DIR = './public_src/javascripts';
const PUBLIC_DIR = './public';
const MODE = 'development';


const modules = ['mw'];
function create_entry() {
    // traverse modules inside of JS_DIR
    return modules.reduce((acc, module) => {
        const module_dir = path.resolve(JS_DIR, module);
        const file_list = fs.readdirSync(module_dir);
        // taverse files in module dir
        const module_entries = file_list.reduce((sub_acc, file) => {
            const entry = {};
            // transform filename cs-grid-cards.js -> grid_cards
            // which is used as entry key
            const entry_key = file.split('-').slice(1).join('_').slice(0, -3);
            const entry_path = path.resolve(module_dir, file);

            entry[entry_key] = entry_path;

            return Object.assign(sub_acc, entry);
        }, {});

        return Object.assign(acc, module_entries);
    }, {});
}

module.exports = [
    {
        mode: MODE,
        watch: true,
        entry: create_entry(),
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
            minimizer: [
                new UglifyJsPlugin({
                    test: /\.js(\?.*)?$/i,
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                }),
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'Output Management',
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
                test: /\.(png|svg|jpg|gif|tif)$/,
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

];
