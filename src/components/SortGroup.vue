<template>
  <div class="divbtn">
    <a-button
      class="sortbtn"
      size="large"
      :type="item.active ? 'primary' : 'default'"
      v-for="(item, index) in sortOptions"
      :key="index"
      @click="handleSortClick(index)"
      v-on:click="$emit('sortChange', item)"
    >
      {{ item.label }}
      <a-icon type="sort-ascending" v-if="item.type === 'asc'" />
      <a-icon type="sort-descending" v-if="item.type === 'desc'" />
    </a-button>
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    defaultOption: String,
    defaultType: {
      type: String,
      default: "asc"
    }
  },
  data() {
    return {
      activeIndex: this.options.findIndex(
        option => option.value === this.defaultOption
      ),
      sortOptions: this.options.map((option, index) => {
        const clone = {
          ...option,
          active: false,
          type: "asc"
        };
        if (index === this.activeIndex) {
          clone.active = true;
          clone.type = this.defaultType;
        }
        return clone;
      })
    };
  },
  methods: {
    handleSortClick(index) {
      if (index === this.activeIndex) {
        const currentSort = this.sortOptions[index];
        currentSort.type = currentSort.type === "asc" ? "desc" : "asc";
      } else {
        const beforeSort = this.sortOptions[this.activeIndex];
        if (beforeSort) {
          beforeSort.active = false;
        }
        const currentSort = this.sortOptions[index];
        currentSort.active = true;
        this.activeIndex = index;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.sortbtn {
  margin-right: 2px;
}
.divbtn {
  position: absolute;
  top: 0px;
  left: 11px;
}
</style>
