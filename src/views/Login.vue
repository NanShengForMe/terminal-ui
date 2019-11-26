<template>
  <div id="login-box">
    <img class="bg" src="@/assets/images/bg.png" />
    <div class="main-box">
      <div class="content">
        <div class="left">
          <h1>使用一卡通登录</h1>
          <h2>请在一体机的感应处，扫描校园一卡通</h2>
          <img class="card" src="@/assets/images/card.png" />
        </div>
        <div class="right">
          <h1>使用微信扫码登录</h1>
          <h2>绑定微信后，使用【扫一扫】功能扫描二维码</h2>
          <!-- <img class="code" src="@/assets/images/two.png" /> -->
          <div id="qrcode-box" class="code"></div>
          <p class="detail">
            <img class="weixin" src="@/assets/images/weixin.png" />
            <span>使用微信【扫一扫】</span>
          </p>
        </div>
      </div>
      <a class="back" href="javascript:void(0);" @click="$router.back()"
        >返回</a
      >
    </div>
  </div>
</template>

<script>
import loginQRCode from "loginQRCode";
import { getTsAndTe } from "@/api/user.js";
import axios from "axios";

export default {
  data() {
    return {
      enableCardTimer: true,
      cardLoginInter: {},
      qrCode: {
        clear() {}
      }
    };
  },
  methods: {
    enableCardLogin() {
      if (!this.enableCardTimer) {
        return false;
      }

      // 校验用加密方法由sfw提供，暂且这样获取验证参数
      getTsAndTe()
        .then(response => {
          if (response != null) {
            this.cardLoginInter = setInterval(() => {
              // 校验用加密方法由sfw提供，暂且这样获取验证参数
              var ts = response.ts;
              var te = response.te;
              var url = "http://127.0.0.1:22322/main?ts=" + ts + "&te=" + te;
              axios
                .post(url)
                .then(res => {
                  console.log("读卡器返回:" + res);
                  // 清除定时器
                  this.destoryCardLogin();
                  console.log("清除轮询读卡器");
                  this.login("CardLogin", res);
                })
                .catch(e => {
                  console.log("读卡器服务异常，请核查clientjar是否运行" + e);
                });
            }, 2000);
          } else {
            console.log("获取验证参数为空（ts&&te）");
            this.enableCardLogin();
          }
        })
        .catch(e => {
          console.log("获取验证参数异常（ts&&te）:" + e);
          this.enableCardLogin();
        });

      // setTimeout(() => {
      //   getCardToken()
      //     .then(token => {
      //       if (token != null) {
      //         this.login("CardLogin", token);
      //       } else {
      //         this.enableCardLogin();
      //       }
      //     })
      //     .catch(this.enableCardLogin());

      // }, 2000);
    },
    destoryCardLogin() {
      this.enableCardTimer = false;
      clearInterval(this.cardLoginInter);
    },
    enableWeixinLogin() {
      // 创建二维码对象
      this.qrCode = new loginQRCode("qrcode-box", 200, 200);
      // 生成微信登录二维码
      this.qrCode.generateLoginQRCode(token =>
        // console.log("ssssss",token)
        this.login("weiXinLogin", token)
      );
    },
    destoryWeixinLogin() {
      this.qrCode.clear();
    },
    login(type, token) {
      this.$store
        .dispatch(type, token)
        .then(user => {
          this.$router.push(this.$route.query.redirect);

          const key = "notification_" + Math.random();
          this.$notification.success({
            message: "登录成功",
            description: `${user.userinfo.name}${
              user.identity === "teacher" ? "老师" : "同学"
            }，欢迎回来`,
            duration: 3,
            key,
            onClick: () => this.$notification.close(key)
          });
        })
        .catch(error => {
          this.$notification.error({
            message: "登录失败",
            description: error.message,
            duration: 3
          });
        });
    }
  },
  mounted() {
    this.enableCardLogin();
    this.enableWeixinLogin();
  },
  beforeDestroy() {
    this.destoryCardLogin();
    this.destoryWeixinLogin();
  }
};
</script>

<style lang="less" scoped>
.main-box {
  width: 1095px;
  height: 592px;
  padding: 50px 40px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -550px;
  margin-top: -240px;
}

.content {
  overflow: hidden;
}

.main-box .left {
  float: left;
  margin-right: 180px;
  margin-left: 70px;
}

.left h1 {
  margin-bottom: 27px;
  font-size: 26px;
  color: #444;
  font-family: Microsoft YaHei, serif;
}

.left h2 {
  margin-bottom: 50px;
  font-size: 22px;
  color: #666;
  font-family: Microsoft YaHei, serif;
}

.left .card {
  margin: 0 auto;
  width: 300px;
  display: block;
}

.main-box .right {
  float: left;
  width: 224px;
}

.right h1 {
  margin-bottom: 27px;
  font-size: 26px;
  color: #444;
  font-family: Microsoft YaHei, serif;
}

.right h2 {
  margin-bottom: 30px;
  font-size: 22px;
  color: #666;
  font-family: Microsoft YaHei, serif;
}

.right .code {
  width: 200px;
  display: block;
  margin: 0 auto;
}

.right .detail {
  color: #69cd1b;
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
}

.detail .weixin {
  width: 30px;
  vertical-align: middle;
}

.back {
  display: block;
  padding: 8px 0;
  background: #eee;
  color: #666;
  font-size: 20px;
  clear: both;
  width: 120px;
  margin: 30px auto 0;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-decoration: none;
}
</style>
