import isArray from '../util/is-array'
import isString from '../util/is-string'

describe('util test suite', () => {
  it('is Array', () => {
    expect(true).toEqual(isArray([]))
    expect(false).toEqual(isArray(''))
  })

  it('is String', () => {
    expect(true).toEqual(isString(''))
    expect(false).toEqual(isString(1))
  })
})