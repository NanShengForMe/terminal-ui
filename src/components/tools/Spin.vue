<template>
  <div id="app-mask" v-show="loading">
    <a-spin size="large" :spinning="loading" />
  </div>
</template>

<script>
export default {
  name: "Span",
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  }
};
</script>

<style lang="less" scoped>
#app-mask {
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 100%;
  height: calc(100% - 112px);
  position: absolute;
  top: 112px;
  left: 0;
  z-index: 99999;
}

#app-mask > .ant-spin {
  position: absolute;
  top: 50%;
}
</style>
