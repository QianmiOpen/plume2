"use strict";
const toString = Object.prototype.toString;
function isArray(param) {
    return toString.call(param) === '[object Array]';
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isArray;
