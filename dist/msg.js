"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 全局的消息订阅分发中心
 */
const mitt = require("mitt");
exports.default = new mitt();
