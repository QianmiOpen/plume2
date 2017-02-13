import msg from '../msg'

describe('msg test suite', () => {
  it('msg emit', () => {
    //binding event
    msg.on('foo', e => {
      expect({
        name: 'plume'
      }).toEqual(e)
    })

    //emit foo
    msg.emit('foo', {name: 'plume'})
  })
})