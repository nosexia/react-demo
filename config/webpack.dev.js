const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    target: 'web',
    output: {
        filename: '[name].js',
        pathinfo: false,
    },
    // devtool: 'eval-source-map',
    cache: {
        type: 'memory'
    },
    optimization: {
        runtimeChunk: true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'all',
                },
            },
        },
        usedExports: true,
    },
    devServer: {
        // static: '../dist',
        hot: true,
        host: '0.0.0.0',
        historyApiFallback: true,
        // // publicPath: path.resolve(__dirname, '../dist'),
        // contentBase: path.join(__dirname, '../public'),
        // open: false,
        // hot: true,
        //  hotOnly: true,
        // quiet: true,
        // port: 8082,
        proxy: {
            '/dev-api': {
                target: 'http://101.6.143.8:65513',
                // secure: false,
                changeOrigin: true,
                // pathRewrite: { '^/dev-api': 'http://10.10.10.17:80/dev-api' },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    // 'postcss-loader',
                ],
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})