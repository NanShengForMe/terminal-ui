/**
 * 以0填充长度
 * @param {Number} value 数字
 * @param {Number} length 长度
 */
export const prefixZero = (value, length) =>
  (Array(length).join(0) + value).slice(-length);
