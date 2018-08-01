"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ViewAction
 * UI = React(State, Action/Event)
 * State = Store(init, Action/Event)
 * UI的Action/Event是入口，出口就是Store的Action/Event
 */
var ViewAction = /** @class */ (function () {
    function ViewAction() {
    }
    //@ts-ignore
    //只会在store中初始化的时候被调用绑定store的上下文
    ViewAction.prototype._bindStore = function (store) {
        this.store = store;
        return this;
    };
    return ViewAction;
}());
exports.ViewAction = ViewAction;
