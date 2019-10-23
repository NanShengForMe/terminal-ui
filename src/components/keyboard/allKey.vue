<template>
  <ul class="keyboard">
    <li
      v-for="(key, index) in keyList"
      :key="index"
      track-by="$index"
      :class="{
        delete: key === 'Delete',
        tab: key === 'Tab',
        capslock: key === 'Caps',
        enter: key === 'Enter',
        shift: key === 'Shift',
        space: key === 'Space',
        shifted: key === 'Shift' && hasShifted,
        capsed: key === 'Caps' && hasCapsed
      }"
      v-text="key"
      @click="clickKey(key)"
    ></li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      keyList: [],
      normalKeyList: [],
      shiftedKeyList: [],
      capsedKeyList: [],
      hasShifted: false,
      hasCapsed: false,
      keyvalue: this.keyboardtext
    };
  },
  created() {
    this.ready();
  },
  methods: {
    clickKey(key) {
      switch (key) {
        case "Delete":
          // var kbt = this.keyvalue;
          //   this.keyvalue = kbt.length ? kbt.substring(0, kbt.length - 1) : kbt;
          this.$emit("delHandle");
          break;

        case "Tab":
          this.keyvalue += "\t";
          break;

        case "Enter":
          this.keyvalue += "\n";
          this.$emit("enterHanle");
          break;

        case "Space":
          this.keyvalue += " ";
          break;

        case "Caps":
          this.hasCapsed = !this.hasCapsed;
          this.keyList = this.hasCapsed
            ? this.capsedKeyList
            : this.normalKeyList;
          break;

        case "Shift":
          this.hasShifted = !this.hasShifted;
          this.keyList = this.hasShifted
            ? this.shiftedKeyList
            : this.normalKeyList;
          break;

        default:
          //   this.keyvalue = key;
          this.$emit("updatekey", key);
          break;
      }
    },
    ready() {
      let normalKeyList = [
          "`",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "0",
          "-",
          "=",
          "Delete",
          "Tab",
          "q",
          "w",
          "e",
          "r",
          "t",
          "y",
          "u",
          "i",
          "o",
          "p",
          "[",
          "]",
          "\\",
          "Caps",
          "a",
          "s",
          "d",
          "f",
          "g",
          "h",
          "j",
          "k",
          "l",
          ";",
          "'",
          "Shift",
          "z",
          "x",
          "c",
          "v",
          "b",
          "n",
          "m",
          ",",
          ".",
          "/",
          "@",
          "Space"
        ],
        shiftedKeyList = [
          "~",
          "!",
          "@",
          "#",
          "$",
          "%",
          "^",
          "&",
          "*",
          "(",
          ")",
          "_",
          "+",
          "Delete",
          "Tab",
          "Q",
          "W",
          "E",
          "R",
          "T",
          "Y",
          "U",
          "I",
          "O",
          "P",
          "{",
          "}",
          "|",
          "Caps",
          "A",
          "S",
          "D",
          "F",
          "G",
          "H",
          "J",
          "K",
          "L",
          ":",
          '"',
          "Shift",
          "Z",
          "X",
          "C",
          "V",
          "B",
          "N",
          "M",
          "<",
          ">",
          "?",
          "@",
          "Space"
        ],
        capsedKeyList = [
          "`",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "0",
          "-",
          "=",
          "Delete",
          "Tab",
          "Q",
          "W",
          "E",
          "R",
          "T",
          "Y",
          "U",
          "I",
          "O",
          "P",
          "[",
          "]",
          "\\",
          "Caps",
          "A",
          "S",
          "D",
          "F",
          "G",
          "H",
          "J",
          "K",
          "L",
          ";",
          "'",
          "Shift",
          "Z",
          "X",
          "C",
          "V",
          "B",
          "N",
          "M",
          ",",
          ".",
          "/",
          "@",
          "Space"
        ];

      this.keyList = this.normalKeyList = normalKeyList;
      this.shiftedKeyList = shiftedKeyList;
      this.capsedKeyList = capsedKeyList;
    }
  }
};
</script>

<style lang="less" scoped>
.keyboard {
  width: 1200px;
  margin: auto;
  height: 450px;
  padding: 0;
  list-style: none;
  user-select: none;
  li {
    color: #fff;
    font-weight: bold;
    font-size: 25px;
    float: left;
    margin: 0 10px 10px 0;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);

    border: 1px solid #e5e5e5;
    border-radius: 5px;

    &:hover {
      position: relative;
      border-color: gray;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.3);
    }
    &:active {
      top: 1px;
      left: 1px;
    }
  }
  .tab {
    margin-left: 20px;
  }
  .delete {
    width: 140px;
  }
  .capslock {
    width: 160px;
    margin-left: 51px;
  }
  .enter {
    width: 140px;
  }
  .shift {
    width: 120px;
    margin-left: 70px;
  }
  .space {
    clear: left;
    width: 681px;
    margin-left: 224px;
  }
  .shifted {
    position: relative;
    top: 1px;
    left: 1px;
    border-color: #e5e5e5;
    cursor: pointer;
  }
  .capsed {
    position: relative;
    top: 1px;
    left: 1px;
    border-color: #e5e5e5;
    cursor: pointer;
  }
}
</style>
