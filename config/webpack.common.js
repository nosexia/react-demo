const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar')
//去除库中没有用到的代码
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
//提取css到单独的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const APP_DIR = path.resolve(__dirname, '../src');
const OUTPUT_DIR = path.resolve(__dirname, '../dist');

module.exports = {
    //如果在package.json中直接定义使用browserslist会导致热更新失效，所以需要判断开发环境和生产环境来来开启browserlist
    // target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    // target: ["browserslist"],
    target: ["web", "es5"],
    // target:false,
    entry: APP_DIR + '/index.tsx',
    cache: {
        type: 'memory'
    },
    output: {
        path: OUTPUT_DIR,
        publicPath: '/',
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].[contenthash:8].js',
        // environment: {
        //     arrowFunction: false, // 环境不支持箭头函数
        //     bigIntLiteral: false,  // 不支持BigInt
        //     const: false,
        //     destructuring: false,  // 不支持解构
        //     dynamicImport: false,  // 不支持异步import
        //     forOf: false,   // 不支持for...of
        //     module: false,  // 不支持module
        // },
    },
    resolve: {
        // 尽可能的减少后缀尝试的可能性
        extensions: ['.tsx', '.ts', '.js'],
        symlinks: false,
        enforceExtension: false,
        // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
        mainFields: ['main'],
        modules: [
            // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
            // 其中 __dirname 表示当前工作目录，也就是项目根目录
            path.resolve(__dirname, '../node_modules')
        ],

        alias: {
            '@/images': path.resolve(__dirname, '../src/assets/images'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@utils': path.resolve(__dirname, '../src/utils'),
            '@api': path.resolve(__dirname, '../src/api'),
            '@pages': path.resolve(__dirname, '../src/pages'),
            '@': path.resolve(__dirname, '../src'),
        }
    },
    module: {
        // 独完整的 `react.production.min.js` 文件就没有采用模块化，忽略对 `react.production.min.js` 文件的递归解析处理
        noParse: /react\.production\.min\.js$/,
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-laoder',
                    options: {
                        //缓存转换出的结果
                        cacheDirectory: true,
                        //只对src目录下的文件使用babel-loader处理，可以缩小命中的范围
                        include: path.resolve(__dirname, '../src'),
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                ["@babel/preset-env",],
                                // "@babel/preset-react",
                                // "@babel/preset-typescript"
                            ],
                            // plugins: [
                            //     [require("@babel/plugin-transform-runtime"), { "legacy": true }],
                            //     [require("@babel/plugin-proposal-class-properties"), { "legacy": true }]
                            // ]
                        },
                    },
                    // {
                    //     loader: 'ts-loader',
                    //     options: {
                    //         transpileOnly: true,
                    //     },
                    // }
                ],
                // exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use : [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    'cache-loader',
                    // Translates CSS into CommonJS
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[local]--[contentHash:base64:8]'
                            }
                        }
                    },
                    'postcss-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            }
                        }
                    }
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    '@svgr/webpack',
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset',
                generator: {
                    filename: 'static/images/[hash][ext][query]'
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 // 4kb
                    }
                }
            },
            {
                test: /\.(?:mp4)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/video/[name]-[hash][ext][query]'
                }
            },
            {
                test: /\.(gltf|glb|bin)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: 'asset/inline',
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/[id].[contenthash].css',
            chunkFilename: 'static/css/[id].[contenthash].css',
            ignoreOrder: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'public/*',
                    to({ context, absoluteFilename }) {
                        return Promise.resolve("[name][ext]");
                    },
                },
            ],
            options: {
                concurrency: 100,
            },
        }),
        // new MomentLocalesPlugin(),
        //编译时的类型检查开发的时候需要去除
        // new ForkTsCheckerWebpackPlugin(),
        new WebpackBar(),
        new HtmlWebpackPlugin({
            title: 'swap721',
            publicPath: '/',
            template: path.resolve(__dirname, '../', 'src/index.html'),
            favicon: path.resolve(__dirname, '../', 'public/favicon.ico'),
            filename: 'index.html'
        }),
    ]
}