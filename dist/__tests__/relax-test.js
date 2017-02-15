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
const relax_1 = require("../relax");
jest.mock('react-dom');
class LoadingActor extends actor_1.default {
    defaultState() {
        return {
            loading: false
        };
    }
}
class HelloActor extends actor_1.default {
    defaultState() {
        return { mott: 'hello world!' };
    }
}
class AppStore extends store_1.default {
    bindActor() {
        return [
            new LoadingActor,
            new HelloActor
        ];
    }
}
let HelloApp = class HelloApp extends React.Component {
    render() {
        return React.createElement(HelloRelax, null);
    }
};
HelloApp = __decorate([
    store_provder_1.default(AppStore)
], HelloApp);
let HelloRelax = class HelloRelax extends React.Component {
    render() {
        const { loading, mott } = this.props;
        return (React.createElement("div", null,
            React.createElement("div", null, loading),
            React.createElement("div", null, mott)));
    }
};
HelloRelax.defaultProps = {
    loading: false,
    mott: ''
};
HelloRelax = __decorate([
    relax_1.default
], HelloRelax);
describe('relax test suite', () => {
    it('initial render relax', () => {
        const tree = renderer.create(React.createElement(HelloApp, null)).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
