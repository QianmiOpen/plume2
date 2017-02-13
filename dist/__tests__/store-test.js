"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const store_1 = require("../store");
const actor_1 = require("../actor");
const decorator_1 = require("../decorator");
class HelloActor extends actor_1.default {
    defaultState() {
        return { name: 'plume' };
    }
    change(state) {
        return state.set('name', 'plume++');
    }
}
__decorate([
    decorator_1.Action('change')
], HelloActor.prototype, "change", null);
class LoadingActor extends actor_1.default {
    defaultState() {
        return { loading: false };
    }
    change(state) {
        return state.set('loading', true);
    }
}
__decorate([
    decorator_1.Action('change')
], LoadingActor.prototype, "change", null);
class AppStore extends store_1.default {
    constructor() {
        super(...arguments);
        this.change = () => {
            this.dispatch('change');
        };
    }
    bindActor() {
        return [
            new HelloActor,
            new LoadingActor
        ];
    }
}
describe('store test suite', () => {
    it('default state', () => {
        const store = new AppStore({});
        //defautlState
        expect({
            loading: false,
            name: 'plume'
        }).toEqual(store.state().toJS());
        //actors
        expect(2).toEqual(store._actors.length);
        //actor'state
        const actorState = store._actorsState;
        expect([{ name: "plume" }, { loading: false }])
            .toEqual([actorState[0].toJS(), actorState[1].toJS()]);
    });
    it('store dispatch', () => {
        const store = new AppStore({});
        store.change();
        const storeState = store.state();
        expect({ loading: true, name: 'plume++' }).toEqual(storeState.toJS());
        const actorsState = store._actorsState;
        expect([{ name: 'plume++' }, { loading: true }])
            .toEqual([actorsState[0].toJS(), actorsState[1].toJS()]);
    });
});
