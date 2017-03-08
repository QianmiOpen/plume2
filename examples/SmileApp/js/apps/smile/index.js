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
const store_1 = require("./store");
const smile_1 = require("./component/smile");
let SmileApp = class SmileApp extends React.Component {
    componentDidMount() {
        this.store.init();
    }
    render() {
        return (<smile_1.default />);
    }
};
SmileApp = __decorate([
    plume2_1.StoreProvider(store_1.default, { debug: true })
], SmileApp);
exports.default = SmileApp;
