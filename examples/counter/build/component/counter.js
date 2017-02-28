"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const plume2_1 = require("plume2");
const noop = () => { };
let Counter = class Counter extends React.Component {
    render() {
        const { count, increment, decrement } = this.props;
        return (React.createElement("div", null,
            React.createElement("a", { href: 'javascript:;', onClick: decrement }, "decrement"),
            React.createElement("span", null, count),
            React.createElement("a", { href: 'javascript:;', onClick: increment }, "increment")));
    }
};
Counter.defaultProps = {
    count: plume2_1.storePath('count', 0),
    increment: plume2_1.storeMethod('increment', () => { }),
    decrement: plume2_1.storeMethod('decrement', () => { }),
};
Counter = __decorate([
    plume2_1.Relax
], Counter);
exports.default = Counter;
