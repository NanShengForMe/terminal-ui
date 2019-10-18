<template>
  <div class="header">
    <router-link :to="home" class="home" v-show="!isHome">
      <a-progress
        type="dashboard"
        style="position: relative; bottom: 5px; margin-right: 5px;"
        :width="32"
        :percent="progressPercent"
        :format="progressFormat"
      />
      <span>首页</span>
    </router-link>
    <router-link :to="home">
      <img class="logo" src="@/assets/images/logo.png" />
      <span class="logo-name">智慧华中大</span>
      <span class="current">{{ product.terminalTitle || "自助服务终端" }}</span>
    </router-link>
    <!-- <div  v-if="user.roles && user.roles.includes('manager')"> -->
    <!-- <span
        class="item pointer single"
        :class="{ active: businessRole === 'personal' }"
        @click="toggleRole"
        >个人</span
      >
      <span
        class="item pointer department"
        :class="{ active: businessRole === 'manager' }"
        @click="toggleRole"
        >单位</span
      > -->
    <a-radio-group
      class="role-switch"
      size="large"
      buttonStyle="solid"
      defaultValue="personal"
      @change="$emit('roleChange', $event.target.value)"
    >
      <a-radio-button value="personal">个人</a-radio-button>
      <a-radio-button value="manager">单位</a-radio-button>
      <a-radio-button value="division">主管</a-radio-button>
    </a-radio-group>
    <!-- </div> -->
    <div class="out pointer" @click="logout" v-if="isLoggedIn">
      <!-- <span class="count">25</span> -->
      <a-progress
        type="dashboard"
        style="display: block;"
        :width="32"
        :status="'exception'"
        :percent="progressPercent"
        :format="progressFormat"
      />
      <span class="logout">退出</span>
    </div>
    <router-link to="/home" class="center" v-if="false">
      <img class="icon" src="@/assets/images/user.png" />
      <span class="my" href="/home">我的</span>
    </router-link>
    <div class="users" v-if="isLoggedIn">
      <div class="name">
        {{ user.userinfo.username }}-{{ user.userinfo.name }}
      </div>
      <div class="role">
        {{ user.identity === "teacher" ? "教师" : "学生" }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "GlobarHeader",
  data() {
    return {
      isHome: true,
      businessRole: "personal",
      countDown: {
        total: 180,
        current: 180,
        timer: null
      }
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "user", "product"]),
    home() {
      return this.isLoggedIn ? "/home" : "/";
    },
    progressPercent() {
      return +((this.countDown.current / this.countDown.total) * 100).toFixed(
        2
      );
    }
  },
  methods: {
    toggleRole() {
      this.businessRole =
        this.businessRole === "personal" ? "manager" : "personal";
    },
    logout() {
      this.$confirm({
        title: "退出确认",
        content: "您确定要退出么?",
        onOk: this.logoutInternal
      });
    },
    logoutInternal() {
      const user = this.user;
      this.$store.dispatch("Logout", this.$route.params.product).then(() => {
        this.$router.push("/");
        this.$notification.info({
          message: "注销登录",
          description: `${user.nickname}${
            user.identity === "teacher" ? "老师" : "同学"
          }，您已安全退出`
        });
      });
    },
    enableCountDown() {
      this.countDown.timer && clearInterval(this.countDown.timer);
      this.countDown.timer = setInterval(() => {
        if (this.countDown.current > 0) {
          this.countDown.current--;
          if (this.progressPercent == 30) {
            this.$notification.warn({
              message: "页面超时",
              description: "页面即将超时自动退出，轻触屏幕可取消"
            });
          }
        } else {
          clearInterval(this.countDown.timer);
          this.$message.loading("超时自动退出", 1, () => {
            if (this.isLoggedIn) {
              this.logoutInternal();
            } else {
              this.$router.push("/");
            }
          });
        }
      }, 1000);
    },
    progressFormat() {
      return `${this.countDown.current}`;
    },
    resetProgress() {
      return (this.countDown.current = this.countDown.total);
    }
  },
  watch: {
    $route(to) {
      this.isHome = to.name === "home" || to.name === "index";
      if (to.matched.some(record => record.meta.countDown !== 0)) {
        this.countDown.total = this.countDown.current = to.meta.countDown || 60;
        this.enableCountDown();
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.resetProgress);
    document.addEventListener("mousemove", this.resetProgress);
    document.addEventListener("touchstart", this.resetProgress);
    document.addEventListener("gesturestart", this.resetProgress);
  }
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  min-width: 1140px;
  height: 112px;
  background: #f5f5f5;
  background: linear-gradient(to bottom, #fff, #eee);
}

.header .home {
  float: left;
  margin-top: 25px;
  margin-left: 18px;
  display: block;
  // width: 110px;
  height: 60px;
  line-height: 50px;
  text-align: center;
  font-size: 32px;
  font-family: Microsoft YaHei, serif;
  color: #005494;
  text-decoration: none;
  border: 2px solid #ddd;
  border-radius: 44px;
  // z-index: 100;
  position: relative;
  /* behavior: url("res/style/ie-css.htc"); */
  background: #f5f5f5;
  padding: 0 10px;
}

.header .logo {
  float: left;
  margin-left: 15px;
  width: 240px;
  margin-top: 24px;
}

.header .logo-name {
  float: left;
  margin-top: 30px;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 36px;
  font-family: RTWSYueGoTrial-Regular, serif;
  /* color: #002855; */
  color: #0f264e;
}

.header .current {
  float: left;
  margin-top: 26px;
  padding-left: 10px;
  height: 58px;
  line-height: 58px;
  /* border-left: 1px solid #4f4d4b; */
  border-left: 1px solid #cec9c2;
  font-size: 40px;
  font-weight: 300;
  font-family: MicrosoftYaHeiLight, serif;
  color: #444444;
}

.header .switch {
  float: left;
  margin-top: 26px;
  margin-left: 15px;
  /* width: 210px; */
  height: 60px;
  border: 2px solid #005495;
  border-radius: 34px;
  // z-index: 100;
  position: relative;
  /* behavior: url("res/style/ie-css.htc"); */
  background: #f5f5f5;
}

.switch .item {
  width: 104px;
  height: 60px;
  line-height: 60px;
  margin-top: -2px;
  text-align: center;
  font-size: 32px;
  font-family: Microsoft YaHei, serif;
  color: #005494;
  display: block;
  float: left;
}

.switch .single {
  margin-left: -1px;
}

.switch .department {
  margin-right: -1px;
}

.switch .active {
  background: #005495;
  color: #fff;
  border-radius: 34px;
  // z-index: 100;
  position: relative;
  /* behavior: url("res/style/ie-css.htc"); */
}

.header .users {
  float: right;
  // margin-right: 20px;
  padding: 0 20px;
  background: #d7dee2;
  height: 100%;
}

.users .name {
  margin-top: 8px;
  font-size: 34px;
  font-family: Microsoft YaHei, serif;
  color: #005494;
}

.users .role {
  display: inline-block;
  padding: 3px 8px;
  background: #005495;
  border-radius: 10px;
  color: #fff;
  font-size: 24px;
  font-family: Microsoft YaHei, serif;
  // z-index: 100;
  position: relative;
  /* behavior: url("res/style/ie-css.htc"); */
}

.header .center {
  float: right;
  margin-right: 40px;
  margin-top: 27px;
  text-align: center;
}

.center .icon {
  display: block;
  width: 30px;
}

.center .my {
  font-size: 18px;
  font-family: Microsoft YaHei, serif;
  color: #18558b;
  font-weight: 600;
  text-decoration: none;
}

.header .out {
  float: right;
  padding: 26px 30px;
  text-align: center;
}

.out .count {
  width: 32px;
  height: 32px;
  line-height: 30px;
  text-align: center;
  color: #d86021;
  border-radius: 100%;
  // z-index: 100;
  position: relative;
  /* behavior: url("res/style/ie-css.htc"); */
  border: 2px solid #d86021;
  display: block;
}

.out .logout {
  font-size: 18px;
  font-family: Microsoft YaHei, serif;
  color: #d86021;
  font-weight: 600;
  text-decoration: none;
}
.role-switch {
  margin-top: 24px;
  margin-left: 20px;
  margin-bottom: 5px;
  border: 2px solid #005495;
  border-radius: 34px;
  background: #fff;

  .ant-radio-button-wrapper {
    height: 60px;
    line-height: 60px;
    font-size: 32px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    border: none;
    border-radius: 34px;
    color: #005495;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background: #005495;
    border-color: #005495;
    color: #fff;
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    background-color: #ffd;
  }
}
</style>
