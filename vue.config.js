module.exports = {
  // 开发环境配置
  devServer: {
    port: 8080,
    open: false,
    // 页面覆盖显示
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      "/proxy/equ": {
        target: "http://equip.leao.hust.edu.cn/sfw/",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/proxy/equ": ""
        }
      },
      "/proxy/fur": {
        target: "http://jj-fdc.hust.edu.cn/sfw/",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/proxy/fur": ""
        }
      },
      "/proxy/122": {
        target: "http://192.168.2.108/sfw/",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/proxy/122": ""
        }
      },
      "/proxy/test": {
        target: "http://192.168.2.220:8080/sfw/",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/proxy/test": ""
        }
      }
    }
  },
  configureWebpack: {
    externals: {
      jQuery: "jQuery",
      qrCode: "QRCode",
      loginQRCode: "loginQRCode"
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 发布路径
  publicPath: "/",
  // 保存时进行语法检查
  lintOnSave: process.env.NODE_ENV === "development"
};
