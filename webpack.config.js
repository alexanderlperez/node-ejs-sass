'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let config = {
    entry: './src/js/site.js',
    output: {
        path: path.resolve(__dirname, './public'), // where everything will end up
        filename: 'js/bundle.js', // relative to public/
    },
    plugins: [
        new ExtractTextWebpackPlugin('styles/styles.css'),
        new HtmlWebpackPlugin({
            template: 'ejs-render-loader!./src/views/index.ejs' // ejs-render-loader needed to process the 'include' directives in EJS
        }),
        new CopyWebpackPlugin([ 
            { from: 'src/img/*', to: 'img', flatten: true },
            { from: 'js/vendor/*', to: 'js/vendor', flatten: true },
        ]),
    ],
    module: {
        rules: [ 
            { 
                // run all project JS files through babel
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                // process all CSS/SASS files declared in JS
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader' ,
                })
            },
            {
                // move all font files that are encountered in processed files (css/scss/js) to ../public/fonts
                // relative to the entry point, src/js/site.js
                test: /\.(ttf|eot|woff|woff2|otf)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts/',
                    publicPath: '../'
                }
            },
            {
                // load all image files encountered in processed files
                // to public/img/, configured above in config.output.path
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader?name=img/[name].[ext]'
            },
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './public'),
        historyApiFallback: true,
        inline: true,
        open: true,
        openPage: '',
    },
    devtool: 'eval-source-map',
};

module.exports = config;
