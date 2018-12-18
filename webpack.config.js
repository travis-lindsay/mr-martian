const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/JS/game.ts',
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
            { test: /\.ts$/, use: 'awesome-typescript-loader' }
        ]
    },
    devServer: {
        port: 3000,
    }
};