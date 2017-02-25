"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @Action
 */
function Action(msg) {
    return function (target, property, descriptor) {
        target._route || (target._route = {});
        target._route[msg] = descriptor.value;
    };
}
exports.Action = Action;
