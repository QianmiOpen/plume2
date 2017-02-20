"use strict";
const ql_1 = require("../ql");
const dql_1 = require("../dql");
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
        const todoDQL = dql_1.DQL('todoDQL', [
            loadingQL,
            ['todo', '$index', 'text'],
            (loading, text) => ({
                loading, text
            })
        ]);
        const todoQL = new dql_1.DynamicQueryLang(todoDQL.name, todoDQL.lang).withContext({ index: 0 }).ql();
        expect(['todo', 0, 'text']).toEqual(todoQL.lang()[1]);
        expect({ loading: false, text: 'hello plume' }).toEqual(store.bigQuery(todoQL));
    });
});
