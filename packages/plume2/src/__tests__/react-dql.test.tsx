import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Map } from 'immutable';
import { Actor, Store, StoreProvider, QL, Relax } from '../index';
import { IMap } from '../typing';

class ProductActor extends Actor {
  defaultState() {
    return {
      products: [
        { id: 1, name: 'p1' },
        { id: 2, name: 'p2' },
        { id: 3, name: 'p3' },
        { id: 4, name: 'p4' },
        { id: 5, name: 'p5' }
      ]
    };
  }
}

class AppStore extends Store {
  bindActor() {
    return [new ProductActor()];
  }
}

@StoreProvider(AppStore)
class ProductApp extends React.Component {
  store: Store;

  render() {
    const products = this.store.state().get('products');

    return (
      <div>
        {products.map((p, index) => {
          return <ProductItem index={index} key={p.get('id')} />;
        })}
      </div>
    );
  }
}

const productQL = QL('productQL', [
  ['products', '$index'],
  /**
   * 
   */
  p => p
]);

@Relax
class ProductItem extends React.Component {
  static defaultProps = {
    index: 0
  };

  static relaxProps = {
    product: productQL
  };

  props: {
    index: boolean;
    relaxProps?: {
      product: IMap;
    };
  };

  render() {
    const { id, name } = this.props.relaxProps.product.toJS();
    return (
      <div>
        <div>{id}</div>
        <div>{name}</div>
      </div>
    );
  }
}

describe('relax dql', () => {
  it('initialize', () => {
    const tree = renderer.create(<ProductApp />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
