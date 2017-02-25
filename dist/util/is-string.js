"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toString = Object.prototype.toString;
function isString(param) {
    return toString.call(param) === '[object String]';
}
exports.default = isString;
