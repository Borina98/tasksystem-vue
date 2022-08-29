const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
    publicPath:  process.env.NODE_ENV === "production" ? './' : "./",
  // devServer:{
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1',// 后端接口
  //       ws:true,
  //       changeOrigin: true, // 是否跨域
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // }
  
})
