<template>
  <div>
    <img class="bg" src="@/assets/images/bg.png" />
    <div class="switch-btn pointer btn-left">
      <img class="tip" src="@/assets/images/tip.png" />
    </div>
    <div class="switch-btn pointer btn-right">
      <img class="tip" src="@/assets/images/tip.png" />
    </div>
    <div class="item-box">
      <MagnetItem
        :item="{
          icon: require('@/assets/images/icon-01.png'),
          title: '打印码',
          desc: '在线打印各个学期的成绩单',
          path: '/codeTag'
        }"
        :imgpath="'icon-01.png'"
        :desc="'打印码描述'"
      />
      <MagnetItem
        :item="{
          icon: require('@/assets/images/icon-01.png'),
          title: '标签',
          desc: '在线打印各个学期的成绩单',
          path: '/assets'
        }"
        :imgpath="'icon-03.png'"
        :desc="'标签打印描述'"
      />
      <MagnetItem
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :imgpath="'icon-02.png'"
        :desc="'单据打印'"
      />
    </div>
  </div>
</template>

<script>
import MagnetItem from "@/components/Magnet/MagnetItem.vue";

export default {
  components: {
    MagnetItem
  },
  computed: {
    items() {
      return this.$store.getters.magnets;
    }
  },
  data() {
    return {
      des: [
        {
          icon: require("@/assets/images/icon-01.png"),
          title: "打印码",
          desc: "在线打印各个学期的成绩单",
          path: "/codeTag"
        },
        {
          icon: require("@/assets/images/icon-01.png"),
          title: "标签",
          desc: "在线打印各个学期的成绩单",
          path: "/assets"
        },
        {
          icon: require("@/assets/images/icon-01.png"),
          title: "单据",
          desc: "在线打印各个学期的成绩单",
          path: "/business"
        },
        {
          icon: require("@/assets/images/icon-01.png"),
          title: "主页",
          desc: "在线打印各个学期的成绩单",
          path: "/home"
        }
      ]
    };
  },
  created() {
    if (!this.items || !this.items.length) {
      this.$store.dispatch("LoadMagnets").catch(error => {
        this.$log.error(error);
        this.$notification.error({
          message: "请求错误",
          description: error.message
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.switch-btn {
  position: fixed;
  top: 9%;
  margin-top: 100px;
  width: 4%;
  height: 72%;
  background: #000000;
  opacity: 0.3;
  border-radius: 10px;
  z-index: 1;
}

.btn-left {
  left: 20px;
}

.btn-right {
  transform: rotate(180deg);
  right: 20px;
}

.tip {
  position: absolute;
  top: 50%;
  margin-top: -25px;
  left: 50%;
  margin-left: -23px;
  width: 45px;
}

.item-box {
  position: absolute;
  top: 20%;
  width: 100%;
  padding: 0 10%;
}
</style>
