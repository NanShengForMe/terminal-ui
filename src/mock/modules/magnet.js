import Mock from "mockjs";

const magnets = [
  {
    icon: require("@/assets/images/icon-01.png"),
    title: "验证码打印",
    desc: "5位短信验证码登陆打印",
    path: "/codeTag"
  },
  {
    icon: require("@/assets/images/icon-01.png"),
    title: "成绩单打印",
    desc: "在线打印各个学期的成绩单",
    path: "/home"
  },
  {
    icon: require("@/assets/images/icon-02.png"),
    title: "在校证明打印",
    desc: "打印在校证明",
    path: "/home"
  },
  {
    icon: require("@/assets/images/icon-03.png"),
    title: "转账业务",
    desc: "银行卡、校园卡互相转账业务",
    path: "/home"
  },
  {
    icon: require("@/assets/images/icon-04.png"),
    title: "出国证明(中)",
    desc: "用于留学、会议交流等",
    path: "/home"
  },
  {
    icon: require("@/assets/images/icon-04.png"),
    title: "出国证明(英)",
    desc: "用于留学、会议交流等",
    path: "/home"
  },
  {
    icon: require("@/assets/images/icon-02.png"),
    title: "户籍证明",
    desc: "打印户籍证明",
    path: "/home"
  }
];

const equipment = [
  {
    icon: require("@/assets/images/icon-01.png"),
    title: "设备标签",
    desc: "打印设备标签",
    path: "/assets"
  },
  {
    icon: require("@/assets/images/icon-02.png"),
    title: "设备建账证明",
    desc: "打印设备建账证明",
    path: "/business"
  }
];

const furniture = [
  {
    icon: require("@/assets/images/icon-03.png"),
    title: "家具标签",
    desc: "打印家具标签",
    path: "/assets"
  },
  {
    icon: require("@/assets/images/icon-04.png"),
    title: "家具建账证明",
    desc: "打印家具建账证明",
    path: "/business"
  }
];

Mock.mock(/\/magnet/, "get", options => {
  const [, productCode] = options.url.match(/\/magnet\/(\w*)/);
  if (productCode === "equipment") {
    return equipment.concat(magnets);
  }
  return furniture.concat(magnets);
});
