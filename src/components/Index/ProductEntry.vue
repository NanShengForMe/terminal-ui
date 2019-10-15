<template>
  <div
    class="entry pointer"
    :class="index == 0 ? 'left' : 'right'"
    @click="toMagnet(product.code)"
  >
    <img class="icon" :src="product.icon" />
    <span class="title">{{ product.name }}</span>
    <span class="detail">{{ product.desc }}</span>
  </div>
</template>

<script>
export default {
  name: "ProductEntry",
  props: {
    index: Number,
    product: Object
  },
  methods: {
    toMagnet(productCode) {
      this.$store
        .dispatch("ToggleProduct", productCode)
        .then(() => this.$router.push("/magnet"));
    }
  }
};
</script>

<style lang="less" scoped>
.entry {
  position: absolute;
  top: 50%;
  margin-top: -80px;
  background: #fff;
  border: 1px solid #cdcbc9;
  box-shadow: 0 3px 6px #00000029;
  opacity: 0.9;
  border-radius: 10px;
  min-width: 397px;
  min-height: 276px;
  display: block;
}

.left {
  left: 50%;
  margin-left: -450px;
}

.right {
  right: 50%;
  margin-right: -450px;
}

.entry .icon {
  display: block;
  width: 64px;
  margin: 32px auto 10px;
}

.entry .title {
  margin: 0 auto;
  width: 324px;
  text-align: center;
  padding-bottom: 20px;
  font-size: 28px;
  border-bottom: 1px solid #4d88b5;
  font-family: Microsoft YaHei, serif;
  color: #005495;
  display: block;
}

.entry .detail {
  margin: 20px auto 40px;
  width: 286px;
  text-align: center;
  font-size: 18px;
  font-family: Microsoft YaHei, serif;
  font-weight: 400;
  line-height: 28px;
  color: #4d88b5;
  display: block;
}
</style>
