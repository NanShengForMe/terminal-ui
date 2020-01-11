<template>
  <div>
    <img class="bg" src="@/assets/images/bg.png" />
    <div class="login-box">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          label="工号"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'sno',
              {
                rules: [{ required: true, message: '请输入您的工号！' }]
              }
            ]"
            @keyup="handleSnoInput($event)"
            @focus="show('sno')"
            allowClear
            size="large"
          >
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item
          label="密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'pwd',
              {
                rules: [{ required: true, message: '请输入您的密码！' }]
              }
            ]"
            type="password"
            @focus="show('pwd')"
            allowClear
            size="large"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">
            登陆
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-drawer
      height="450"
      placement="bottom"
      :closable="false"
      @close="onClose"
      :visible="showBoard"
    >
      <all-key-board
        @enterHanle="enterKeyVal"
        @delHandle="delKeyVal"
        @updatekey="GetKeyVal"
      />
    </a-drawer>
  </div>
</template>

<script>
// import axios from "axios";
import allKeyBoard from "@/components/keyboard/allKey";

export default {
  data() {
    return {
      showBoard: false,
      currentInputType: "",
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  components: { allKeyBoard },
  methods: {
    enterKeyVal() {},
    onClose() {
      this.showBoard = false;
    },
    delKeyVal() {
      // this.value = this.value.substr(0, this.value.length - 1);
      if (this.currentInputType === "sno") {
        this.form.setFieldsValue({
          sno:
            this.form.getFieldValue("sno") == undefined
              ? ""
              : this.form
                  .getFieldValue("sno")
                  .substr(0, this.form.getFieldValue("sno").length - 1)
        });
      }
      if (this.currentInputType === "pwd") {
        this.form.setFieldsValue({
          pwd:
            this.form.getFieldValue("pwd") == undefined
              ? ""
              : this.form
                  .getFieldValue("pwd")
                  .substr(0, this.form.getFieldValue("pwd").length - 1)
        });
      }
    },
    GetKeyVal(val) {
      if (this.currentInputType === "sno") {
        this.form.setFieldsValue({
          sno:
            (this.form.getFieldValue("sno") == undefined
              ? ""
              : this.form.getFieldValue("sno")) + val
        });
      }
      if (this.currentInputType === "pwd") {
        this.form.setFieldsValue({
          pwd:
            (this.form.getFieldValue("pwd") == undefined
              ? ""
              : this.form.getFieldValue("pwd")) + val
        });
      }
    },
    keyDown(val) {
      console.log(val);
    },
    hideKeyboard(data) {
      // -----------------------------------------传值请求---------------------------------------------------------
      console.log("拿获取的值来做操作", data);
      // 输入完成隐藏键盘
      // document.activeElement.blur(); // ios隐藏键盘
      // this.$refs.input.blur(); // android隐藏键盘
      this.showBoard = false;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let userName = values.sno;
          let pwd = values.pwd;
          console.log("=========================" + JSON.stringify(values));
          console.log(userName);
          console.log(pwd);
          this.$store
            .dispatch("systemUserLogin", { userName, pwd })
            .then(user => {
              //  this.$router.push(this.$route.query.redirect);
              this.$router.push("/magnet");

              const key = "notification_" + Math.random();
              this.$notification.success({
                message: "登录成功",
                description: `${user.userinfo.name}
               老师
             ，欢迎回来`,
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
      });
    },
    handleSnoInput(e) {
      e.stopPropagation();
    },
    show(type) {
      //   e.stopPropagation();
      this.currentInputType = type;
      this.showBoard = true;
    }
  }
};
</script>

<style lang="less" scoped>
.login-box {
  width: 500px;
  height: 222px;
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: white;
  margin-left: -250px;
  margin-top: -111px;
  padding: 30px;
  border-radius: 3px;
}
</style>
