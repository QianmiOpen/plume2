"use strict";
class Actor {
    defaultState() {
        return {};
    }
    receive(msg, state, params) {
        this._route = this._route || {};
        const action = this._route[msg];
        return action ? action.call(this, state, params) : state;
    }
    route(name) {
        this._route = this._route || {};
        return name ? this._route[name] : this._route;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Actor;
