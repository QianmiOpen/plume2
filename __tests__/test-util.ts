import isString from "../src/util/is-string";
import isArray from "../src/util/is-array";

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