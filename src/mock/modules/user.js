import Mock from "mockjs";

const user = {
  username: "@integer(10000, 99999)",
  nickname: "@cname",
  "roles|1": ["personal", "manager"],
  "identity|1": ["student", "teacher"],
  token: "@guid",
  email: "@email",
  lastLoginTime: "@datetime",
  lastLoginIp: "@ip",
  lastLoginCity: "@city"
};

Mock.mock(/\/login\/card\/token/, "get", void 0);

Mock.mock(/\/login\/card/, "post", user);

Mock.mock(/\/login\/weixin/, "post", user);

Mock.mock(/\/logout/, "get", void 0);
