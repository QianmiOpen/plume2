"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ql_1 = require("../ql");
const actor_1 = require("../actor");
const store_1 = require("../store");
class LoadingActor extends actor_1.default {
    defaultState() {
        return { loading: false };
    }
}
class TodoActor extends actor_1.default {
    defaultState() {
        return {
            todo: [
                { id: 1, text: 'hello plume', done: false }
            ]
        };
    }
}
class AppStore extends store_1.default {
    bindActor() {
        return [
            new LoadingActor,
            new TodoActor
        ];
    }
}
describe('dql test suite', () => {
    it('init dql', () => {
        const store = new AppStore({});
        const loadingQL = ql_1.QL('loadingQL', [
            'loading',
            (loading) => loading
        ]);
        const todoDQL = ql_1.QL('todoDQL', [
            loadingQL,
            ['todo', '$index', 'text'],
            (loading, text) => ({
                loading, text
            })
        ]);
        const lang = todoDQL.withContext({ index: 0 }).analyserLang(todoDQL.lang());
        const todoQL = new ql_1.QueryLang('todoQL', lang);
        expect(['todo', 0, 'text']).toEqual(todoQL.lang()[1]);
        expect({ loading: false, text: 'hello plume' }).toEqual(store.bigQuery(todoQL));
    });
    it('dql nested dql', () => {
        const store = new AppStore({});
        const loadingDQL = ql_1.QL('loadingDQL', [
            '$loading',
            (loading) => loading
        ]);
        const todoDQL = ql_1.QL('todoDQL', [
            loadingDQL,
            ['todo', '$index', 'text'],
            (loading, text) => ({ loading, text })
        ]);
        const lang = todoDQL.withContext({ index: 0, loading: 'loading' }).analyserLang(todoDQL.lang());
        const todoQL = new ql_1.QueryLang('todoDQL', lang);
        expect(['todo', 0, 'text']).toEqual(todoQL.lang()[1]);
        expect({ loading: false, text: 'hello plume' }).toEqual(store.bigQuery(todoQL));
    });
});
