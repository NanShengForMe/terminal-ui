import Cookie from "js-cookie";
// import global from 'global'

/**
 * 设置Cookie
 * @param {String} name
 * @param {String} value
 * @param {Number} expireTime 日期单位：天
 **/
const setCookie = (name, value, expireTime, f) => {
  Cookie.set(name, value, {
    expires: expireTime || 7,
    // domain: global.domain,
    path: "/"
  });
  f && f();
};

/**
 * 获取Cookie
 * @param {String} name
 * @return token
 **/
const getCookie = name => {
  const token = Cookie.get(name);
  if (token) return token;
  else return false;
};

/**
 * 删除Cookie
 * @param {String} name
 * @return token
 **/
const removeCookie = name => {
  Cookie.remove(name, {
    // domain: global.domain,
    path: "/"
  });
};

// 设置TOKEN
const TOKEN = "JSESSIONID";

const getToken = () => getCookie(TOKEN);

const setToken = (value, f) => {
  setCookie(TOKEN, value, null, f);
};

const removeToken = () => {
  removeCookie(TOKEN);
};

export { setCookie, getCookie, removeCookie, getToken, setToken, removeToken };
