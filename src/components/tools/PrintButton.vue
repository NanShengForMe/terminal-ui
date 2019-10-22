<template>
  <span>
    <a-button
      :type="btnType"
      :size="btnSize"
      :icon="btnIcon"
      @click="handleClick"
      :disabled="disabled"
      :params="params"
      >{{ btnText }}</a-button
    >
    <a-modal
      :visible="visible"
      title="单据打印"
      :centered="true"
      :closable="false"
      :destroyOnClose="true"
      :okButtonProps="okButtonProps"
      :cancelButtonProps="cancelButtonProps"
      okText="打印完成"
      cancelText="打印失败"
      @ok="printOk"
      @cancel="printError"
    >
      <div class="print-animation" v-show="printing">
        <div class="tag" v-show="type === 'tag'">
          <span class="bs">标签出口</span>
        </div>
        <div class="doc" v-show="type === 'doc'">
          <span class="bs">单据出口</span>
        </div>
      </div>
      <h1 align="center">{{ modalText }}</h1>
      <a-list
        :grid="{ gutter: 12, column: 3 }"
        :dataSource="payList"
        v-show="payListVisible"
      >
        <a-list-item
          slot="renderItem"
          slot-scope="item, index"
          @click="choosePay(item)"
        >
          <a-card :title="`第${index + 1}笔支出`">
            <p>{{ item.subject }}</p>
            <em>{{ item.submit_time | format }}</em>
          </a-card>
        </a-list-item>
      </a-list>
      <iframe
        :src="printUrl"
        width="0"
        height="0"
        frameborder="0"
        name="printFrame"
      ></iframe>
    </a-modal>
  </span>
</template>

<script>
import $ from "jQuery";
import Qs from "qs";
import {
  queryProjectPayList,
  getPrintUrl,
  getTagAction
} from "@/api/billLink.js";

export default {
  props: {
    // 单据类型 tag: 标签, doc: 业务单据
    type: {
      type: String,
      default: "doc"
    },
    // 单据编号
    billCode: String,
    // 打印参数
    params: {
      type: Object,
      default: function() {
        return {};
      }
    },

    disabled: {
      type: Boolean,
      default: true
    },
    btnType: {
      type: String,
      default: "primary"
    },
    btnSize: {
      type: String,
      default: "large"
    },
    btnIcon: {
      type: String,
      default: "printer"
    },
    btnText: {
      type: String,
      default: "打印单据"
    }
  },
  data() {
    return {
      visible: false,
      modalText: "",
      printUrl: "",
      interval: null,
      printing: false,
      okButtonProps: {
        props: {
          size: "large",
          icon: "check",
          loading: false,
          disabled: false
        }
      },
      cancelButtonProps: {
        props: {
          size: "large",
          icon: "close",
          type: "danger",
          disabled: false
        }
      },
      payList: [
        // {
        //   subject: "立项",
        //   submit_time: new Date()
        // },
        // {
        //   subject: "立项",
        //   submit_time: new Date()
        // },
        // {
        //   subject: "立项",
        //   submit_time: new Date()
        // },
        // {
        //   subject: "立项",
        //   submit_time: new Date()
        // }
      ],
      payListVisible: false,
      printParams: this.params
    };
  },
  methods: {
    handleClick() {
      // 显示modal
      this.visible = true;
      // 如果是在建工程, 一笔业务可能关联了多笔付款信息, 用户可自行选择打印哪一笔业务
      if (this.printParams.businessCode === "project") {
        queryProjectPayList(this.printParams.businessId)
          .then(list => {
            if (list.length <= 0 || (list.length === 1 && !list[0].pay_id)) {
              this.modalText = "暂无可打印单据";
              this.okButtonProps.props.disabled = true;
              this.cancelButtonProps.props.disabled = true;
              // 自动关闭modal
              setTimeout(() => {
                this.visible = false;
              }, 3000);
            } else if (list.length === 1) {
              // 只有一笔付款信息则直接默认打印
              this.printParams.payId = list[0].pay_id || "";
              this.printParams.businessId = list[0].pay_id || "";
              this.print();
            } else {
              // 多笔付款信息则展示列表，由用户选择
              this.modalText = "请选择需要打印的支出";
              this.payList = list;
              this.payListVisible = true;
            }
          })
          .catch(error => {
            this.$log.error(error);
          });
      } else {
        // 其他业务直接打印
        this.print();
      }
    },
    choosePay(pay) {
      this.payListVisible = false;
      this.printParams = pay;
      this.print();
    },
    print() {
      if (this.type === "tag") {
        // 标签直接拼接打印地址即可，注意：此处的地址需响应系统配置，二维码标签或条形码标签
        var tagAction = "";
        getTagAction()
          .then(url => {
            tagAction = url;
          })
          .catch(error => {
            this.$log.error(error);
            this.visible = false;
          });
        this.printUrl =
          "e?page=" +
          tagAction +
          "&" +
          Qs.stringify(this.printParams, { arrayFormat: "brackets" });
        this.printInternal();
      } else {
        // 业务单据需要通过billCode和打印参数获取真实的url
        this.params.code = this.billCode;
        getPrintUrl(this.params)
          .then(url => {
            this.printUrl = url;
            this.printInternal();
          })
          .catch(error => {
            this.$log.error(error);
            this.visible = false;
          });
      }
    },
    printInternal() {
      this.modalText = "正在获取单据, 请稍候...";
      this.okButtonProps.props.disabled = true;
      this.cancelButtonProps.props.disabled = true;

      setTimeout(() => {
        const iframe = window.frames["printFrame"];
        if (iframe) {
          this.interval = setInterval(() => {
            try {
              if ("complete" === iframe.document.readyState) {
                this.showDoing(iframe.document);
              }
            } catch (error) {
              try {
                this.showDoing(iframe.document);
              } catch (error) {
                this.showDoing(error);
              }
            }
          }, 500);
        } else {
          this.showDoing();
        }
      }, 500);
    },
    showDoing(doc) {
      clearInterval(this.interval);
      this.okButtonProps.props.disabled = false;
      this.cancelButtonProps.props.disabled = false;

      this.printing = true;
      this.okButtonProps.props.loading = true;
      setTimeout(() => {
        this.okButtonProps.props.loading = false;
      }, 1500);

      if (doc && doc.title) {
        var cause = $(".shortMsg", doc).html();
        this.modalText = cause;
        // 标记为打印失败, 记录失败原因
        // printError(cause);
      } else {
        this.modalText = "正在打印中, 请稍候...";
      }
    },
    printOk() {
      this.visible = false;
      this.$emit("ok");
    },
    printError() {
      this.visible = false;
      this.$emit("error");
    }
  }
};
</script>

<style lang="less" scoped>
/* 正在打印动画 */
.print-animation {
  width: 410px;
  height: 530px;
  background: url(~@/assets/images/machine.png) center 0 no-repeat;
  margin: 0 auto;
  z-index: 99;
}
.print-animation .tag {
  width: 60px;
  height: 160px;
  background-image: url(~@/assets/images/tag.png);
  background-repeat: no-repeat;
  position: absolute;
  left: 50%;
  margin-left: -30px;
  top: 400px;
}
.print-animation .doc {
  width: 130px;
  height: 160px;
  background: url(~@/assets/images/document.png) center -30px no-repeat;
  position: absolute;
  left: 50%;
  margin-left: -65px;
  top: 470px;
}
.print-animation .disabled {
  display: none;
}

.print-animation .tag .bs {
  display: block;
  width: 200px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  position: absolute;
  top: -30px;
  left: 50%;
  margin-left: -100px;
}
.print-animation .doc .bs {
  display: block;
  width: 200px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  position: absolute;
  top: -45px;
  left: 50%;
  margin-left: -100px;
}

.print-animation .tag {
  animation: print-tag 1.5s infinite ease-in;
}
.print-animation .doc {
  animation: print-doc 1.5s infinite ease-in;
}
@keyframes print-tag {
  0% {
    background-position: center -85px;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.2;
  }
  100% {
    background-position: center 160px;
    opacity: 0;
  }
}
@keyframes print-doc {
  0% {
    background-position: center -135px;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.2;
  }
  100% {
    background-position: center 160px;
    opacity: 0;
  }
}
</style>
