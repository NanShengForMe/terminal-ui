<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <globar-header @roleChange="handleRoleChange" />
      <router-view ref="content" />
      <!-- <transition name="fade"> -->
      <!-- </transition> -->
      <Spin />
    </div>
  </a-locale-provider>
</template>

<script>
import Spin from "@/components/tools/Spin.vue";
import GlobarHeader from "@/components/GlobarHeader.vue";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
  components: {
    Spin,
    GlobarHeader
  },
  data() {
    return {
      zh_CN
    };
  },
  methods: {
    handleRoleChange(role) {
      this.$refs.content.$emit("roleChange", role);
    }
  }
};
</script>
<style lang="less" scoped>
#app {
  height: 100%;
}
</style>
