import Mock from "mockjs";
const assetsTypes = [
  {
    value: "equipment",
    label: "设备"
  },
  {
    value: "furniture",
    label: "家具"
  },
  {
    value: "software",
    label: "软件"
  }
];
const businessType = [
  {
    value: "accept",
    label: "验收建账",
    children: [
      {
        value: "acceptance",
        label: "资产验收"
      },
      {
        value: "request",
        label: "设备建账"
      },
      {
        value: "requestfurniture",
        label: "家具建账"
      }
    ]
  },
  {
    value: "change",
    label: "变动业务",
    children: [
      {
        value: "pricechange",
        label: "价格变动"
      },
      {
        value: "keeperchange",
        label: "领用人变更"
      },
      {
        value: "cannibalize",
        label: "资产调拨"
      }
    ]
  },
  {
    value: "disposal",
    label: "处置业务",
    children: [
      {
        value: "scrap",
        label: "报废"
      },
      {
        value: "lost",
        label: "报失"
      },
      {
        value: "flittingout",
        label: "转出"
      },
      {
        value: "backstock",
        label: "退库"
      }
    ]
  }
];

const keepers = [
  {
    label: "张三",
    value: "001"
  },
  {
    label: "李四",
    value: "002"
  },
  {
    label: "王五",
    value: "003"
  }
];
const deps = [
  {
    label: "化学学院",
    value: "001"
  },
  {
    label: "物理学院",
    value: "002"
  },
  {
    label: "生物学院",
    value: "003"
  }
];
Mock.mock(/\/getAssetsTypes/, "get", assetsTypes);
Mock.mock(/\/getBusinessType/, "get", businessType);
Mock.mock(/\/getBaseTeacher/, "get", keepers);
Mock.mock(/\/getBaseDep/, "get", deps);
