const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/server.ts',
    devtool: 'inline-source-map',
    mode: 'development',
    target: 'node',
    watch: true,
    externals: [ nodeExternals() ],
    plugins: [
        new WebpackShellPluginNext({
            onBuildStart:{
                scripts: ['echo "===> Starting packing with WEBPACK 5"'],
                blocking: true,
                parallel: false
            },
            onBuildEnd:{
                scripts: ['npm run run:server'],
                blocking: false,
                parallel: true
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/db/", to: "./db/" },
            ],
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
