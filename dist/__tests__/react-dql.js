"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const React = require("react");
const renderer = require("react-test-renderer");
const index_1 = require("../index");
jest.mock('react-dom');
class ProductActor extends index_1.Actor {
    defaultState() {
        return {
            products: [
                { id: 1, name: 'p1' },
                { id: 2, name: 'p2' },
                { id: 3, name: 'p3' },
                { id: 4, name: 'p4' },
                { id: 5, name: 'p5' },
            ]
        };
    }
}
class AppStore extends index_1.Store {
    bindActor() {
        return [
            new ProductActor
        ];
    }
}
let ProductApp = class ProductApp extends React.Component {
    render() {
        const products = this.store.state().get('products');
        return (React.createElement("div", null, products.map((p, index) => {
            return React.createElement(ProductItem, { index: index, key: p.get('id') });
        })));
    }
};
ProductApp = __decorate([
    index_1.StoreProvider(AppStore)
], ProductApp);
const productQL = index_1.QL('productQL', [
    ['products', '$index'],
    p => p
]);
let ProductItem = class ProductItem extends React.Component {
    render() {
        const { id, name } = this.props.product.toJS();
        return (React.createElement("div", null,
            React.createElement("div", null, id),
            React.createElement("div", null, name)));
    }
};
ProductItem.defaultProps = {
    index: 0,
    product: productQL
};
ProductItem = __decorate([
    index_1.Relax
], ProductItem);
describe('relax dql', () => {
    it('initialize', () => {
        const tree = renderer.create(React.createElement(ProductApp, null)).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
