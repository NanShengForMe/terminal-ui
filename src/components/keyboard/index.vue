<template>
  <div class="container">
    <ul class="keyboard" v-for="(item, index) in list" :key="index">
      <li
        v-for="(key, index) in item.item"
        :key="index"
        track-by="$index"
        :class="{
          delete: key === 'Delete'
        }"
        v-text="key"
        @click="clickKey(key)"
      ></li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      keyvalue: ""
    };
  },
  created() {
    this.ready();
  },
  methods: {
    clickKey(key) {
      if (key === "Delete") {
        this.$emit("delHandle");
      } else {
        this.$emit("updatekey", key);
      }
    },
    ready() {
      this.list = [
        {
          item: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Delete"]
        },
        {
          item: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
        },
        {
          item: ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
        },
        {
          item: ["Z", "X", "C", "V", "B", "N", "M"]
        }
      ];
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 500px;
  bottom: 0;
  left: 50%;
  margin-left: -50%;
  background: rgba(0, 0, 0, 0.8);
  .keyboard {
    width: 1000px;
    margin: auto;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    li {
      font-size: 20px;
      list-style: none;
      margin: 0 15px 5px 0;
      width: 70px;
      height: 70px;
      line-height: 70px;
      color: #fff;
      font-weight: bold;
      text-align: center;
      //   background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      &:hover {
        position: relative;
        border-color: gray;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
      }
      &:active {
        top: 1px;
        left: 1px;
      }
    }
    .delete {
      width: 100px;
    }
  }
}

//   .tab,
//   .delete {
//     width: 70px;
//   }
//   .capslock {
//     width: 80px;
//   }
//   .enter {
//     width: 77px;
//   }
//   .shift {
//     width: 102px;
//   }
//   .space {
//     clear: left;
//     margin-left: 87px;
//     width: 681px;
//   }
//   .shifted {
//     position: relative;
//     top: 1px;
//     left: 1px;
//     border-color: #e5e5e5;
//     cursor: pointer;
//   }
//   .capsed {
//     position: relative;
//     top: 1px;
//     left: 1px;
//     border-color: #e5e5e5;
//     cursor: pointer;
//   }
// }
</style>
