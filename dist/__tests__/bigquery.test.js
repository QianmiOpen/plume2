"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const immutable_1 = require("immutable");
let uuid = 0;
class TodoActor extends index_1.Actor {
    defaultState() {
        return {
            filter: '',
            todo: []
        };
    }
    add(state, text) {
        return state.update('todo', todo => todo.push(immutable_1.fromJS({
            id: ++uuid,
            text,
            done: false
        })));
    }
}
__decorate([
    index_1.Action('add')
], TodoActor.prototype, "add", null);
class AppStore extends index_1.Store {
    constructor() {
        super(...arguments);
        this.add = (text) => {
            this.dispatch('add', text);
        };
    }
    bindActor() {
        return [new TodoActor];
    }
}
const todoQL = index_1.QL('todoQL', [
    'todo',
    'filter',
    (todo, filter) => todo
]);
const countQL = index_1.QL('countQL', [
    todoQL,
    todo => todo.count()
]);
describe('bigquery test suite', () => {
    it('initial state', () => {
        const store = new AppStore({ debug: true });
        let count = store.bigQuery(countQL);
        expect(count).toEqual(0);
        store.add('hello');
        count = store.bigQuery(countQL);
        expect(count).toEqual(1);
    });
});
