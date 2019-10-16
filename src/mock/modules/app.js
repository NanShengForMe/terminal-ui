import Mock from "mockjs";

Mock.mock(/\/config/, "get", {
  title: "自助服务终端",
  products: [
    {
      icon: require("@/assets/images/equipment.png"),
      code: "equipment",
      name: "设备管理系统",
      desc: Mock.mock("@csentence(30)"),
      terminalTitle: "设备自助服务终端",
      proxy: "/proxy/equ",
      url: {
        getMagnets: "assets.terminal.patch.getMagnets",
        billAndConfigCache: "base.business.bill.queryPrintableBill",
        sortedNodeCache: "base.business.process.node.querySortedNode",
        getBaseTeacher: "base.teacher.autocomplete",
        getBaseDep: "assets.acceptance.division.assetsDepsAuto",
        getBusinessList: "terminal.query.businessList"
      }
    },
    // {
    //   icon: require("@/assets/images/furniture.png"),
    //   code: "furniture",
    //   name: "家具管理系统",
    //   desc: Mock.mock("@csentence(30)"),
    //   terminalTitle: "家具自助服务终端",
    //   proxy: "/proxy/fur",
    //   url: {
    //     getMagnets: "assets.terminal.patch.getMagnets",
    //     billAndConfigCache: "base.business.bill.queryPrintableBill",
    //     sortedNodeCache: "base.business.process.node.querySortedNode"
    //   }
    // },
    // {
    //   icon: require("@/assets/images/equipment.png"),
    //   code: "122",
    //   name: "测试系统",
    //   desc: Mock.mock("@csentence(30)"),
    //   terminalTitle: "设备自助服务终端",
    //   proxy: "/proxy/122",
    //   url: {
    //     getMagnets: "terminal.query.queryPrintableBusiness",
    //     billAndConfigCache: "base.business.bill.queryPrintableBill",
    //     sortedNodeCache: "base.business.process.node.querySortedNode"
    //   }
    // },
    {
      icon: require("@/assets/images/equipment.png"),
      code: "test",
      name: "本地系统",
      desc: Mock.mock("@csentence(30)"),
      terminalTitle: "设备自助服务终端",
      proxy: "/proxy/test",
      url: {
        getMagnets: "terminal.query.queryPrintableBusiness",
        billAndConfigCache: "base.business.bill.queryPrintableBill",
        sortedNodeCache: "base.business.process.node.querySortedNode",
        getBaseTeacher: "base.teacher.autocomplete",
        getBaseDep: "assets.acceptance.division.assetsDepsAuto",
        getBusinessList: "terminal.query.businessList"
      }
    }
  ]
});
