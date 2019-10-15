import Mock from "mockjs";

const assetsList = new Array(100).fill().map((item, index) => {
  const bool = index % 2 === 0;
  return {
    type: bool ? "设备" : "家具",
    code: "SB20190814" + (Math.random() * (Math.random() * 100000)).toFixed(2),
    name: "资产名称",
    image: require("@/assets/images/weixin.png"),
    price: (Math.random() * (Math.random() * 100000)).toFixed(2),
    factoryNo: (Math.random() * (Math.random() * 100000)).toFixed(2),
    stockDate: new Date(),
    checked: false
  };
});
Mock.mock(/\/assets/, "get", assetsList);
