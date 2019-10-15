<template>
  <div class="security-code-wrap">
    <img class="bg" src="@/assets/images/bg.png" alt />
    <h1 class="security-code-container titleSize">请输入5位打印码</h1>
    <label for="code">
      <ul class="security-code-container">
        <li class="field-wrap" v-for="(item, index) in number" :key="index">
          <i class="char-field">{{ value[index] || placeholder }}</i>
        </li>
      </ul>
    </label>

    <input
      class="input-code"
      @keyup="handleInput($event)"
      @focus="show"
      v-model="value"
      id="code"
      name="code"
      type="tel"
      :maxlength="number"
      autocorrect="on"
      autocomplete="on"
      autocapitalize="on"
    />

    <span class="number-msg">
      温馨提示："打印码"为5位的数字/字母的编号,
      在业务审批通过/业务办结后以短信方式下发到您的手机.
    </span>
    <a-drawer
      height="450"
      placement="bottom"
      :closable="false"
      @close="onClose"
      :visible="showBoard"
      wrapClassName="codeTag"
    >
      <!-- <key-board @delHandle="delKeyVal" @updatekey="GetKeyVal" /> -->
      <all-key-board
        @enterHanle="enterKeyVal"
        @delHandle="delKeyVal"
        @updatekey="GetKeyVal"
      />
    </a-drawer>
  </div>
</template>
<script>
// 数字字母键盘
// import KeyBoard from "@/components/keyboard/index";
// 全键盘
import allKeyBoard from "@/components/keyboard/allKey";
import { validatePrintCode } from "@/api/printCodeLogin.js";
export default {
  name: "SecurityCode",
  props: {
    number: {
      type: Number,
      default: 5
    },
    placeholder: {
      type: String,
      default: "-"
    }
  },
  // variables
  data() {
    return {
      value: "",
      visible: false,
      layout: "normal",
      input: null,
      showBoard: false,
      keyShow: false,
      numberList: [],
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      params: {
        printCode: this.value,
        successUrl:
          "e?page=terminal.bill.printCode.print&printCode=" +
          window.btoa(this.value)
      }
    };
  },
  components: { allKeyBoard },
  watch: {},
  methods: {
    enterKeyVal() {},
    onClose() {
      this.showBoard = false;
    },
    delKeyVal() {
      this.value = this.value.substr(0, this.value.length - 1);
    },
    GetKeyVal(val) {
      this.value += val;
      if (this.value.length >= this.number) {
        this.hideKeyboard(this.value);
      }
      if (this.value.length >= 5) {
        this.handleSubmit();
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
    handleSubmit() {
      this.$emit("input", this.value);
      this.params.printCode = this.value;
      validatePrintCode(this.params)
        .then(response => {
          console.log(response);
          if (response) {
            this.$router.push(`/detailCodeTag/${this.params.printCode}`);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleInput(e) {
      e.stopPropagation();
      console.log(this, e);
      if (e.key === "Backspace") {
        this.value.substr(0, this.value.length - 1);
      }
      this.$refs.input.value = this.value;
      if (this.value.length >= this.number) {
        this.hideKeyboard();
      }

      this.handleSubmit();
    },
    accept(text) {
      alert("Input text: " + text);
      this.hide();
    },
    show(e) {
      e.stopPropagation();
      this.showBoard = true;
    },
    hide() {
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.security-code-wrap {
  overflow: hidden;
}
.security-code-container {
  margin: 40px;
  padding: 0;
  display: flex;
  justify-content: center;
  .field-wrap {
    list-style: none;
    display: block;
    width: 200px;
    height: 200px;
    line-height: 60px;
    font-size: 60px;
    text-align: center;
    padding-top: 60px;

    background-color: #fff;
    margin: 2px;
    color: #000;
    .char-field {
      font-style: normal;
      padding-top: 60px;
    }
  }
}
.input-code {
  position: absolute;
  left: -9999px;
  top: -99999px;
  width: 0;
  height: 0;
  opacity: 0;
  overflow: visible;
  z-index: -1;
}
.number-msg {
  margin: 0;
  justify-content: center;
  display: flex;
  padding: 0;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
}
.titleSize {
  font-size: 50px;
  color: #fff;
}
.ant-drawer-content-wrapper {
  height: 500px;
}
</style>
