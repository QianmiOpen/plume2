/**
 * 判断数据类型模块
 * 为什么这样判断？这个说来话长...
 */
const toString = Object.prototype.toString;

/**
 * 判断是不是字符串
 * @param param
 */
export const isString = (param: any) =>
  toString.call(param) === '[object String]';

/**
 * 判断是不是数组
 * @param param
 */
export const isArray = (param: any) =>
  toString.call(param) === '[object Array]';
