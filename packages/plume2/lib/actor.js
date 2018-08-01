"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * actor
 *
 * 借鉴MapReduce的理念，store负责分派，actor负责处理
 */
var Actor = /** @class */ (function () {
    function Actor() {
        this._route = this._route || {};
    }
    Actor.prototype.defaultState = function () {
        return {};
    };
    /**
     * 接收store分派的任务
     * @param msg
     * @param state
     * @param params
     */
    Actor.prototype.receive = function (_a) {
        var msg = _a.msg, state = _a.state, params = _a.params;
        var fn = this._route[msg];
        return fn ? fn.call(this, state, params) : state;
    };
    return Actor;
}());
exports.default = Actor;
