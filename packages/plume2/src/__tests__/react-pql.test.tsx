import React from 'react';
import renderer from 'react-test-renderer';
import { Actor, QL, Relax, Store, StoreProvider } from '../index';
import { PQL } from '../pql';
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
          return <ProductItem key={p.get('id')} />;
        })}
      </div>
    );
  }
}

const productPQL = PQL(index => QL('productQL', [['products', index], p => p]));

@Relax
class ProductItem extends React.Component {
  static relaxProps = {
    productByIndex: productPQL
  };

  props: {
    relaxProps?: {
      productByIndex: (index: number) => IMap;
    };
  };

  render() {
    const { productByIndex } = this.props.relaxProps;
    const { id, name } = productByIndex(1).toJS();
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
