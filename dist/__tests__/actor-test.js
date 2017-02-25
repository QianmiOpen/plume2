"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const actor_1 = require("../actor");
const decorator_1 = require("../decorator");
class HelloActor extends actor_1.default {
    defaultState() {
        return {
            name: 'plume'
        };
    }
    change(state) {
        return state.set('name', 'plume++');
    }
}
__decorate([
    decorator_1.Action('change')
], HelloActor.prototype, "change", null);
describe('actor test suite', () => {
    it('default state', () => {
        const helloActor = new HelloActor;
        expect({ name: 'plume' }).toEqual(helloActor.defaultState());
    });
    it('@Action method', () => {
        const helloActor = new HelloActor;
        const state = immutable_1.Map({ name: 'plume' });
        const newState = helloActor.receive('change', state);
        expect({ name: 'plume++' }).toEqual(newState.toJS());
    });
});
