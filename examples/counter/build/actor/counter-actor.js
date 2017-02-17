"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const plume2_1 = require("plume2");
class CounterActor extends plume2_1.Actor {
    defaultState() {
        return { count: 0 };
    }
    increment(state) {
        return state.update('count', count => count + 1);
    }
    decrement(state) {
        return state.update('count', count => count - 1);
    }
}
__decorate([
    plume2_1.Action('increment')
], CounterActor.prototype, "increment", null);
__decorate([
    plume2_1.Action('decrement')
], CounterActor.prototype, "decrement", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CounterActor;
