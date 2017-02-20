import * as React from 'react'
import * as renderer from 'react-test-renderer'
import StoreProvider from '../store-provder'
import Store from '../store'
import { Action } from '../decorator'
import Actor from '../actor'
import Relax from '../relax'
import { QL } from '../ql'
import { DQL } from '../dql'
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
    return { mott: 'hello world!' }
  }

  @Action('change')
  change(state, text) {
    return state.set('mott', text)
  }
}

class AppStore extends Store {
  constructor(props) {
    super(props)
    window['_store'] = this
  }

  bindActor() {
    return [
      new LoadingActor,
      new HelloActor
    ]
  }
}

@StoreProvider(AppStore, { debug: false })
class HelloApp extends React.Component {
  render() {
    return <HelloRelax />
  }
}

const loadingQL = QL('loadingQL', [
  'loading',
  loading => loading
])

const mottQL = QL('mottQL', [
  loadingQL,
  'mott',
  (loading, mott) => ({ loading, mott })
])

const loadingDQL = DQL('loadingDQL', [
  '$mottFlag',
  loading => loading
])


@Relax
class HelloRelax extends React.Component {
  props: {
    mottFlag: string;
    loading: boolean;
    mott: string;
    loadingQL: boolean;
    mottQL: { loading: boolean; mott: string };
    loadingDQL: boolean;
  };

  static defaultProps = {
    mottFlag: 'mott',
    loading: false,
    mott: '',
    loadingQL,
    mottQL,
    loadingDQL
  }

  render() {
    const {loading, mott, loadingQL, mottQL, loadingDQL} = this.props

    expect(false).toEqual(loadingQL)

    expect({ loading: false, mott: 'hello world!' })
      .toEqual(mottQL)
    expect("hello world!").toEqual(loadingDQL)

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
    const tree = renderer.create(<HelloApp />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('sync dispatch event', () => {
    @StoreProvider(AppStore)
    class HelloApp extends React.Component {
      render() {
        return <Hello />
      }
    }

    @Relax
    class Hello extends React.Component {
      props: { mott: string };

      static defaultProps = {
        mott: ''
      };

      render() {
        return (
          <div>
            <div>{this.props.mott}</div>
          </div>
        )
      }
    }

    const component = renderer.create(<HelloApp />)
    const store = window['_store'] as AppStore
    //同步渲染
    store.dispatch('change', 'hello plume')
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('async dispatch event', () => {
    @StoreProvider(AppStore)
    class HelloApp extends React.Component {
      render() {
        return <Hello />
      }
    }

    @Relax
    class Hello extends React.Component {
      props: { mott: string };

      static defaultProps = {
        mott: ''
      };

      render() {
        return (
          <div>
            <div>{this.props.mott}</div>
          </div>
        )
      }
    }

    const component = renderer.create(<HelloApp />)
    const store = window['_store'] as AppStore
    store.dispatch('change', 'hello plume')

    process.nextTick(() => {
      const tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

})

