import * as React from 'react'
import * as renderer from 'react-test-renderer'

import {
  Actor,
  Store,
  Relax,
  QL,
  StoreProvider
} from '../index'

import { Map } from 'immutable'

jest.mock('react-dom')

type IMap = Map<string, any>

class ProductActor extends Actor {
  defaultState() {
    return {
      products: [
        { id: 1, name: 'p1' },
        { id: 2, name: 'p2' },
        { id: 3, name: 'p3' },
        { id: 4, name: 'p4' },
        { id: 5, name: 'p5' },
      ]
    }
  }
}

class AppStore extends Store {
  bindActor() {
    return [
      new ProductActor
    ]
  }
}

@StoreProvider(AppStore)
class ProductApp extends React.Component {
  store: Store;

  render() {
    const products = this.store.state().get('products')

    return (
      <div>
        {products.map((p, index) => {
          return <ProductItem index={index} key={p.get('id')} />
        })}
      </div>
    )
  }
}

const productQL = QL('productQL', [
  ['products', '$index'],
  p => p
])

@Relax
class ProductItem extends React.Component {
  static defaultProps = {
    index: 0
  };

  static relaxProps = {
    product: productQL
  }

  props: {
    index: 0,
    relaxProps: {
      product: IMap
    }
  }

  render() {
    const { id, name } = this.props.relaxProps.product.toJS();
    return (
      <div>
        <div>{id}</div>
        <div>{name}</div>
      </div>
    )
  }
}

describe('relax dql', () => {
  it('initialize', () => {
    const tree = renderer.create(<ProductApp />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})