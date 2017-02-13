"use strict";
const immutable_1 = require("immutable");
class Store {
    constructor(props) {
        this._state = immutable_1.fromJS({});
        this._actorsState = [];
        this._actors = this.bindActor();
        this.reduceActor();
    }
    bindActor() {
        return [];
    }
    reduceActor() {
        this._state = this._state.withMutations(state => {
            for (let actor of this._actors) {
                let initState = immutable_1.fromJS(actor.defaultState());
                this._actorsState.push(initState);
                state = state.merge(initState);
            }
            return state;
        });
    }
    state() {
        return this._state;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Store;
