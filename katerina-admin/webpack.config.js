const path = require("path");
const BannerPlugin = require("webpack").BannerPlugin;
const CommonsChunkPlugin = require("webpack").optimize.CommonsChunkPlugin;
const IgnorePlugin = require("webpack").IgnorePlugin;
const moment = require("moment");
const package = require("../package.json")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const autoprefixer = require("autoprefixer");

module.exports = {
    entry: {
        home: [ "./content/js/home.js" ],
        sights: [ "./content/js/sights.js" ]
    },
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: "/public/",
        filename: "[name].js",
        libraryTarget: "umd"
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "content/js")
                ],
                exclude: [
                    "../node_modules"
                ],
                loader: "babel-loader",
                options: {
                    presets: [ "env" ]
                }
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, "content/scss")
                ],
                use: [
                    {
                        loader: "style-loader/url"
                    },
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].css",
                            publicPath: "/",
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers: [
                                        "ie >= 10", 
                                        "last 2 version"
                                    ]
                                })
                            ],
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.jpg$/,
                include: [
                    path.resolve(__dirname, "content/images")
                ],
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "images/",
                            publicPath: "/",
                        }
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        modules: [
            "../node_modules",
            path.resolve(__dirname, "content")
        ],
        extensions: [ ".js", ".scss" ]
    },
    devtool: "source-map",
    plugins: [
        new IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CommonsChunkPlugin({
            name: "vendor",
            minChunks: function(module){
                return module.context && module.context.includes("node_modules");
            }
        }),
        new CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new BannerPlugin({
            banner: `
            @project     ${package.name}
            @author      ${package.author}
            @build       ${moment().format("LLLL")}
            @release     [file] [hash]
            @copyright   Copyright (c) ${moment().format("YYYY")}, ${package.author}`
        })
        //new UglifyJsPlugin()
    ],
    devServer: {
        proxy: {
            "/admin": "http://localhost:7776/"
        },
        contentBase: false,
        compress: true,
        port: 9000,
        open: true,
        openPage: "admin",
        publicPath: "/"
    }
};