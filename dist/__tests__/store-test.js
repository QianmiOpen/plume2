"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    changeTexst(state, text) {
        return state.set('name', text);
    }
}
__decorate([
    decorator_1.Action('change')
], HelloActor.prototype, "change", null);
__decorate([
    decorator_1.Action('changeText')
], HelloActor.prototype, "changeTexst", null);
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
    changeTransation() {
        this.transaction(() => {
            this.dispatch('changeText', 'iflux2');
            this.dispatch('changeText', 'plume');
            this.dispatch('changeText', 'plume2');
        });
    }
}
describe('store test suite', () => {
    it('default state', () => {
        const store = new AppStore();
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
        const store = new AppStore({ debug: false });
        store.change();
        const storeState = store.state();
        expect(storeState.toJS()).toEqual({ loading: true, name: 'plume++' });
        const actorsState = store._actorsState;
        expect([{ name: 'plume++' }, { loading: true }])
            .toEqual([actorsState[0].toJS(), actorsState[1].toJS()]);
    });
    it('store transation disptch', () => {
        const store = new AppStore({ debug: false });
        store.changeTransation();
        store.subscribe(state => {
            expect(state.toJS()).toEqual({
                loading: false,
                name: 'plume2'
            });
        });
    });
    it('store subscribe', () => {
        const store = new AppStore({});
        const _handleStoreChange = (state) => {
            expect({ loading: true, name: 'plume++' })
                .toEqual(store.state());
        };
        store.subscribe(_handleStoreChange);
        expect(1).toEqual(store._callbacks.length);
        store.unsubscribe(_handleStoreChange);
        expect(0).toEqual(store._callbacks.length);
    });
});
