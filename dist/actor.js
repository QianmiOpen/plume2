"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Actor {
    defaultState() {
        return {};
    }
    receive(msg, state, params) {
        this._route = this._route || {};
        const fn = this._route[msg];
        return fn ? fn.call(this, state, params) : state;
    }
}
exports.default = Actor;
