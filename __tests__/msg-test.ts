import { msg } from "../src/index";

describe('msg test suite', () => {
  it('msg emit', () => {
    //binding event
    msg.on('foo', e => {
      expect(e).toEqual({
        name: 'plume'
      })
    })
    msg.emit('foo', { name: 'plume' })
  })
})