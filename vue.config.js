const path = require('path')
const packageName = require('./package.json').name
const port = '2244'
module.exports = {
    // 选项...
    publicPath: process.env.PUBLICPATH,
    outputDir: process.env.dist,
    devServer: {
        port,
        proxy: {
            '/rhea': {
                target: 'https://ca.healthstar.pharmeyes.com',
                changeOrigin: true
            }
        },
        hot: false,
        headers: {
            'Access-Control-Allow-Origin':'*'
        }
    },
    productionSourceMap: false,
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
    },
    configureWebpack: {
        output: {
            library: `${packageName}-[name]`,
            libraryTarget: 'umd',
            jsonpFunction: `webpackJsonp_${packageName}`,
        },
    }
};

function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/assets/css/commonFun.scss'),
            ],
        })
}