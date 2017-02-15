import * as React from 'react'
import * as renderer from 'react-test-renderer'
import StoreProvider from '../store-provder'
import Store from '../store'
import Actor from '../actor'
import Relax from '../relax'
jest.mock('react-dom')

class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: false
    }
  }
}

class HelloActor extends Actor {
  defaultState() {
    return {mott: 'hello world!'}
  }
}

class AppStore extends Store {
  bindActor() {
    return [
      new LoadingActor,
      new HelloActor
    ]
  }
}

@StoreProvider(AppStore)
class HelloApp extends React.Component {
  render() {
    return <HelloRelax/>
  }
}

@Relax
class HelloRelax extends React.Component {
  props: {
    loading: boolean;
    mott: string
  };

  static defaultProps = {
    loading: false,
    mott: ''
  }

  render() {
    const {loading, mott} = this.props

    return (
      <div>
        <div>{loading}</div>
        <div>{mott}</div>
      </div>
    )
  }
}

describe('relax test suite', () => {
  it('initial render relax', () => {
    const tree = renderer.create(<HelloApp/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

