"use strict";
const ql_1 = require("../ql");
describe('ql test suite', () => {
    it('ql init', () => {
        const helloQL = ql_1.default('helloQL', [
            'loading',
            (loading) => loading
        ]);
        expect(1).toEqual(helloQL.id());
        expect('helloQL').toEqual(helloQL.name());
        expect(helloQL.lang()).toMatchSnapshot();
    });
});
