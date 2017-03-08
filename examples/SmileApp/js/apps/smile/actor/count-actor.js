"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plume2_1 = require("plume2");
class CountActor extends plume2_1.Actor {
    defaultState() {
        return { count: 1 };
    }
    change(state) {
        return state.update('count', count => count + 1);
    }
    init(state, count) {
        return state.set('count', count);
    }
}
__decorate([
    plume2_1.Action('increment')
], CountActor.prototype, "change", null);
__decorate([
    plume2_1.Action('init')
], CountActor.prototype, "init", null);
exports.default = CountActor;
