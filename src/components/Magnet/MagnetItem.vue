<template>
  <router-link :to="item.path" class="item pointer">
    <a-icon
      :type="icon"
      style="color: white;font-size: 72px;position: absolute;left: 10px;top: 20px;"
    />
    <!-- <img class="icon" :src="require('@/assets/images/' + imgpath)" /> -->
    <div class="title">{{ item.title }}</div>
    <span class="line"></span>
    <div class="detail">{{ desc }}</div>
  </router-link>
</template>

<script>
export default {
  name: "MagnetItem",
  props: {
    item: Object,
    icon: String,
    desc: String
  }
};
</script>

<style lang="less" scoped>
.item {
  position: relative;
  float: left;
  min-width: 358px;
  min-height: 196px;
  margin: 10px;
  padding: 15px 15px 15px 90px;
  background: #005495;
  border: #004479;
  border-radius: 10px;
  display: block;
}

.item .icon {
  position: absolute;
  top: 10px;
  left: 3px;
  width: 86px;
}

.item .title {
  font-size: 28px;
  font-family: MicrosoftYaHeiLight, serif;
  color: #fff;
}

.item .line {
  margin: 8px 0 5px 0;
  width: 162px;
  height: 1px;
  border: 1px solid #fff;
  opacity: 0.3;
  display: block;
}

.item .detail {
  width: 162px;
  font-size: 18px;
  font-family: MicrosoftYaHeiLight, serif;
  color: #fff;
  line-height: 28px;
}
</style>
