"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plume2_1 = require("plume2");
const counter_actor_1 = require("./actor/counter-actor");
class AppStore extends plume2_1.Store {
    constructor() {
        super(...arguments);
        this.increment = () => {
            this.dispatch('increment');
        };
        this.decrement = () => {
            this.dispatch('decrement');
        };
    }
    bindActor() {
        return [new counter_actor_1.default];
    }
}
exports.default = AppStore;
