"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 消息中心
 * usage
 *  import {msg} from 'plume2'
 *
 *  //绑定
 *  msg.on('hello', (param) => console.log(param))
 *  //触发
 *  msg.emit('hello', 'hello')
 *  //解绑
 *  msg.off('hello')
 */
var mitt_1 = __importDefault(require("mitt"));
var msg = new mitt_1.default();
exports.default = msg;
