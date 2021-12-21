const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//打包前移除/清理打包目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//错误信息友好提示
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
module.exports = {
    devtool: 'inline-source-map',
    entry: {
        app: './src/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]_[chunkhash:8].bundle.js',
        //每次构建前清除上一次构建的产物
        // clean:true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|svg|)$/,
                type: 'asset/inline'
            },
            {
                test: /\.(scss|css|less)/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    },
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '智能复杂体系演示验证系统',
            template: path.resolve(__dirname, '../', 'public/index.html'),
            filename: 'index.html'
        }),

    ]
}