"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MockConsole = /** @class */ (function () {
    function MockConsole() {
        this._logs = [];
        this.mock();
    }
    MockConsole.prototype.mock = function () { };
    MockConsole.prototype.mockFn = function () {
        var _this = this;
        return jest.fn(function (log) { return _this._logs.push(log); });
    };
    Object.defineProperty(MockConsole.prototype, "logs", {
        get: function () {
            return this._logs;
        },
        enumerable: true,
        configurable: true
    });
    MockConsole.prototype.reset = function () {
        this._logs = [];
    };
    return MockConsole;
}());
exports.MockConsole = MockConsole;
var MockWarn = /** @class */ (function (_super) {
    __extends(MockWarn, _super);
    function MockWarn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockWarn.prototype.mock = function () {
        console.warn = this.mockFn();
    };
    return MockWarn;
}(MockConsole));
exports.MockWarn = MockWarn;
var MockLog = /** @class */ (function (_super) {
    __extends(MockLog, _super);
    function MockLog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockLog.prototype.mock = function () {
        console.log = this.mockFn();
    };
    return MockLog;
}(MockConsole));
exports.MockLog = MockLog;
