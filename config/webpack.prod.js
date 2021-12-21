const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//压缩CSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
//提取css到单独的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge')

const common = require('./webpack.common');
module.exports = merge(common, {
    mode: 'production',
    // devtool: 'source-map',
    // output: {
    //     filename: '[name]_[chunkhash:8].js',
    // },
    cache: {
        type: 'memory'
    },
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), '...'],
        splitChunks: {
            cacheGroups: {
                commons: {
                    //方案一剥离react和reactdom
                    test: /(react|react-dom|ant-design)/,
                    name: 'vender',
                    // name(module, chunks, cacheGroupKey) {
                    //   const moduleFileName = module
                    //     .identifier()
                    //     .split('/')
                    //     .reduceRight((item) => item);
                    //   const allChunksNames = chunks.map((item) => item.name).join('~');
                    //   return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                    // },
                    chunks: 'all',
                    //方案二剥离所有的库到vendor
                    // test: /[\\/]node_modules[\\/]/,
                    // name: 'vendors',
                    // chunks: 'all',
                    //方案三
                    // test: /[\\/]node_modules[\\/]/,
                    // // cacheGroupKey here is `commons` as the key of the cacheGroup
                    // name(module, chunks, cacheGroupKey) {
                    //   const moduleFileName = module
                    //     .identifier()
                    //     .split('/')
                    //     .reduceRight((item) => item);
                    //   const allChunksNames = chunks.map((item) => item.name).join('~');
                    //   return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                    // },
                    // chunks: 'all',
                },
            },
        },
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`,
        }
    },
    performance: {
        assetFilter: function assetFilter(assetFilename) {
            return assetFilename.endsWith('.jpg') || assetFilename.endsWith('.png');
        },
    },
    resolve: {
        alias: {
            // 使用 alias 把导入 react 的语句换成直接使用单独完整的 react.production.min.js 文件，
            // 减少耗时的递归解析操作
            'react': path.resolve(
                __dirname,
                '../node_modules/react/umd/react.production.min.js'
            ),
        },
    },
    module: {
        noParse: /react\.production\.min\.js$/,
        rules: [
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './',
                        },
                    },
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
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
            ignoreOrder: false,
        }),
        new CleanWebpackPlugin({
            // cleanOnceBeforeBuildPatterns: ['**/*'],
        }),
        new BundleAnalyzerPlugin(),
        // new HtmlWebpackPlugin({
        //     // chunks: ['vendors'],
        //     title: '智能复杂体系演示验证系统',
        //     template: path.resolve(__dirname, '../', 'public/index.ejs'),
        //     filename: 'index.html',
        //     // minify: false,
        // }),
    ],
})