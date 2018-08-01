"use strict";
/**
 * 绑定Actor的Action
 * Usage:
 *  class HelloActor extends Actor {
 *     @Action('hello')
 *     hello(state) {
 *       return state;
 *     }
 *  }
 *
 * @param msg 事件名
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = function (msg) { return function (target, 
//@ts-ignore
property, descriptor) {
    target._route || (target._route = {});
    /**
     * 如果有actor的Action中有重名的事件名，warning
     */
    if (process.env.NODE_ENV != 'production') {
        if (target._route[msg]) {
            var actorName = target.constructor.name;
            console.warn("\uD83D\uDE0E" + actorName + " had @Action('" + msg + "'), Please review your code.");
        }
    }
    target._route[msg] = descriptor.value;
}; };
