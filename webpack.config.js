const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/JS/game.ts',
    mode: 'development', // Change to production for prod build
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1
          }
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    devServer: {
        port: 3000,
    },
};