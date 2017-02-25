"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ql_1 = require("../ql");
const store_1 = require("../store");
const actor_1 = require("../actor");
class LoadingActor extends actor_1.default {
    defaultState() {
        return { loading: true };
    }
}
class TodoActor extends actor_1.default {
    defaultState() {
        return { todo: [{ id: 1, text: 'hello plume', done: false }] };
    }
}
class AppStore extends store_1.default {
    bindActor() {
        return [new LoadingActor, new TodoActor];
    }
}
describe('ql test suite', () => {
    it('ql init', () => {
        const helloQL = ql_1.QL('helloQL', [
            'loading',
            (loading) => loading
        ]);
        expect(1).toEqual(helloQL.id());
        expect('helloQL').toEqual(helloQL.name());
        expect(helloQL.lang()).toMatchSnapshot();
    });
    it('test bigQuery', () => {
        const todoQL = ql_1.QL('todoQL', [
            'loading',
            ['todo', 0, 'text'],
            (loading, text) => ({
                loading,
                text
            })
        ]);
        const store = new AppStore({});
        const todo = store.bigQuery(todoQL);
        expect({
            loading: true,
            text: 'hello plume'
        }).toEqual(todo);
    });
    it('test complex bigQuery', () => {
        const loadingQL = ql_1.QL('loadingQL', [
            'loading',
            (loading) => loading
        ]);
        const todoQL = ql_1.QL('todoQL', [
            loadingQL,
            ['todo', 0, 'text'],
            (loading, text) => ({
                loading,
                text
            })
        ]);
        const store = new AppStore({});
        const loading = store.bigQuery(loadingQL);
        expect(true).toEqual(loading);
        const todo = store.bigQuery(todoQL);
        expect({ loading: true, text: 'hello plume' })
            .toEqual(todo);
        //from cache
        const todoCache = store.bigQuery(todoQL);
        expect({ loading: true, text: 'hello plume' })
            .toEqual(todoCache);
    });
});
