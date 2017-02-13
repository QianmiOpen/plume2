"use strict";
const toString = Object.prototype.toString;
function isString(param) {
    return toString.call(param) === '[object String]';
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isString;
