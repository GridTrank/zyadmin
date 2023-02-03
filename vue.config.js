const path = require('path');
module.exports = {
    // publicPath: './',
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://192.168.0.247:8080', // 内
    //             // target: 'http://210.12.63.2:10450', // 外
    //             // target: 'http://47.104.251.175:80', // 阿里云
    //             pathRewrite: {
    //                 '^/api': ''
    //             },
    //             ws: false, // 是否支持 webstocket, 默认是 true
    //             changeOrigin: true // 用于控制请求头中的 host 值, 默认是 ture
    //         }
    //     }
    // },
    // outputDir: `${srcFile}`, // 在npm run build时 生成文件的目录 type:string, default:'dist'
    // productionSourceMap: false // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        }
    },
    productionSourceMap: false
};
