"use strict";
const is_array_1 = require("../util/is-array");
const is_string_1 = require("../util/is-string");
describe('util test suite', () => {
    it('is Array', () => {
        expect(true).toEqual(is_array_1.default([]));
        expect(false).toEqual(is_array_1.default(''));
    });
    it('is String', () => {
        expect(true).toEqual(is_string_1.default(''));
        expect(false).toEqual(is_string_1.default(1));
    });
});
