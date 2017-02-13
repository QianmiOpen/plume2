"use strict";
/**
 * 全局的消息订阅分发中心
 */
const mitt = require("mitt");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new mitt();
