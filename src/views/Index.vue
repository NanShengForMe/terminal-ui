<template>
  <div>
    <img class="bg" src="@/assets/images/bg.png" alt />
    <!-- <div
      class="entry pointer"
      :class="index == 0 ? 'left' : 'right'"
      v-for="(product, index) in products"
      :key="index"
      @click="toMagnet(product.code)"
    >
      <img class="icon" :src="product.icon" />
      <span class="title">{{ product.name }}</span>
      <span class="detail">{{ product.desc }}</span>
    </div> -->
    <ProductEntry
      v-for="(product, index) in products"
      :key="index"
      :index="index"
      :product="product"
    />
  </div>
</template>

<script>
import ProductEntry from "@/components/Index/ProductEntry.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    ProductEntry
  },
  computed: {
    ...mapGetters(["products"])
  },
  created() {
    if (!this.products.length) {
      this.$store.dispatch("LoadConfig").catch(error => {
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

<style lang="less" scoped></style>
