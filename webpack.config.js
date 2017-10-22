const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const config = require('config');

module.exports = {
    entry: {
        app: path.resolve(__dirname, './src/app.js'),
        react: [
            'react',
            'react-dom'
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.svg$/,
                exclude: /\.inline\.svg$/,
                use: 'svg-react-loader'
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader?modules&importLoaders=1!less-loader'
            }
        ]
    },

    plugins: [
        new Webpack.optimize.CommonsChunkPlugin({
            names: ['react'],
            minChunks: Infinity,
            filename: '[name].js'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new Webpack.optimize.UglifyJsPlugin({
            compress: {
                'screw_ie8': true,
                'warnings': false,
                'unused': true,
                'dead_code': true
            },
            output: {
                comments: false
            },
            sourceMap: false
        })
    ],
    performance: {
        hints: false
    },
    devtool: isProduction ? 'cheap-source-map' : 'eval-source-map',
    devServer: {
        proxy: {
            '**': {
                limit: '50mb',
                target: `http://localhost:${config.get('port')}`,
                bypass: function(req, res, opt) {
                    // don't proxy HTTP requests that originate from a browser ("historyApiFallback with backend support")
                    if (req.headers.accept.indexOf('html') !== -1) {
                        return '/';
                    }
                }
            }
        }
    }
};