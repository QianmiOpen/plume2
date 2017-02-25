"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toString = Object.prototype.toString;
function isArray(param) {
    return toString.call(param) === '[object Array]';
}
exports.default = isArray;
