"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const React = require("react");
const renderer = require("react-test-renderer");
const store_provder_1 = require("../store-provder");
const store_1 = require("../store");
const actor_1 = require("../actor");
const decorator_1 = require("../decorator");
jest.mock('react-dom');
class HelloActor extends actor_1.default {
    defaultState() {
        return { name: 'plume' };
    }
    change(state) {
        return state.set('name', 'plume++');
    }
}
__decorate([
    decorator_1.Action('change')
], HelloActor.prototype, "change", null);
class AppStore extends store_1.default {
    constructor(props) {
        super(props);
        this.change = () => {
            this.dispatch('change');
        };
        window['_store'] = this;
    }
    bindActor() {
        return [new HelloActor];
    }
}
let Home = class Home extends React.Component {
    render() {
        return (React.createElement("div", null, this.state.name));
    }
};
Home = __decorate([
    store_provder_1.default(AppStore)
], Home);
describe('store provider test suite', () => {
    it('first render', () => {
        const tree = renderer.create(React.createElement(Home, null)).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('store sync dispath change render', () => {
        const component = renderer.create(React.createElement(Home, null));
        const store = window['_store'];
        //测试同步渲染
        store.change();
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
