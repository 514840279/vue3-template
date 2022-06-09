module.exports = {
    publicPath: './', // 基本路径
    outputDir: 'dist', // 输出文件目录
    assetsDir: "static", //放置生成的静态文件目录（js css img）
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  

    devServer: {
        proxy: {
            '^/serve': {
                target: 'http://chuxuezhe.wang:8001/', //接口域名
                changeOrigin: true,             //是否跨域
                // ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/serve': '/serve'
                }
            }
        }
    },
      configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {// 为生产环境修改配置...
          config.mode = 'production';
          config["performance"] = {//打包文件大小配置
            "maxEntrypointSize": 10000000,
            "maxAssetSize": 30000000
          }
        }
      }

      
};
