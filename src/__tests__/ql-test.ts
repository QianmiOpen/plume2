import QL from '../ql'

describe('ql test suite', () => {
  it('ql init', () => {
    const helloQL = QL('helloQL', [
      'loading',
      (loading) => loading
    ])

    expect(1).toEqual(helloQL.id())
    expect('helloQL').toEqual(helloQL.name())
    expect(helloQL.lang()).toMatchSnapshot()
  })
})