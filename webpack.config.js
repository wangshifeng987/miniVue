const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {

    //开发模式
    mode: 'development',
    // 打包的入口文件
    entry:'./src/index.js',
    // 输出的出口文件
    output: {
        // 必须指定的是绝对路径
        path: path.join(__dirname, './dist'),
        filename: 'main.js'
    },
    // 启动一个serve
    devServer: {
        contentBase: './dist',
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
          // 配置，index.html 模板，以此为模板进行注入
          template: './src/index.html'
        })
      ]
}