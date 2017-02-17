"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const React = require("react");
const ReactDOM = require("react-dom");
const plume2_1 = require("plume2");
const store_1 = require("./store");
const counter_1 = require("./component/counter");
if (__DEV__) {
    require('preact/devtools');
}
let CounterApp = class CounterApp extends React.Component {
    render() {
        return React.createElement(counter_1.default, null);
    }
};
CounterApp = __decorate([
    plume2_1.StoreProvider(store_1.default, { debug: __DEV__ })
], CounterApp);
ReactDOM.render(React.createElement(CounterApp, null), document.getElementById('app'));
