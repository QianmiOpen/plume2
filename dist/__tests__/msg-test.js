"use strict";
const msg_1 = require("../msg");
describe('msg test suite', () => {
    it('msg emit', () => {
        //binding event
        msg_1.default.on('foo', e => {
            expect({
                name: 'plume'
            }).toEqual(e);
        });
        //emit foo
        msg_1.default.emit('foo', { name: 'plume' });
    });
});
