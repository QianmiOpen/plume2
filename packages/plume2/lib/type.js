"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 判断数据类型模块
 * 为什么这样判断？这个说来话长...
 */
var toString = Object.prototype.toString;
/**
 * 判断是不是字符串
 * @param param
 */
exports.isString = function (param) {
    return toString.call(param) === '[object String]';
};
/**
 * 判断是不是数组
 * @param param
 */
exports.isArray = function (param) {
    return toString.call(param) === '[object Array]';
};
