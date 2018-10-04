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
var BaseMock = /** @class */ (function () {
    function BaseMock() {
        this._logs = [];
        this.mock();
    }
    BaseMock.prototype.mock = function () { };
    BaseMock.prototype.mockFn = function () {
        var _this = this;
        return jest.fn(function (log) { return _this._logs.push(log); });
    };
    Object.defineProperty(BaseMock.prototype, "logs", {
        get: function () {
            return this._logs;
        },
        enumerable: true,
        configurable: true
    });
    BaseMock.prototype.reset = function () {
        this._logs = [];
    };
    return BaseMock;
}());
exports.BaseMock = BaseMock;
var MockWarn = /** @class */ (function (_super) {
    __extends(MockWarn, _super);
    function MockWarn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockWarn.prototype.mock = function () {
        console.warn = this.mockFn();
    };
    return MockWarn;
}(BaseMock));
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
}(BaseMock));
exports.MockLog = MockLog;
var MockDir = /** @class */ (function (_super) {
    __extends(MockDir, _super);
    function MockDir() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockDir.prototype.mock = function () {
        console.dir = this.mockFn();
    };
    return MockDir;
}(BaseMock));
exports.MockDir = MockDir;
var MockDebug = /** @class */ (function (_super) {
    __extends(MockDebug, _super);
    function MockDebug() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockDebug.prototype.mock = function () {
        console.debug = this.mockFn();
    };
    return MockDebug;
}(BaseMock));
exports.MockDebug = MockDebug;
var MockError = /** @class */ (function (_super) {
    __extends(MockError, _super);
    function MockError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockError.prototype.mock = function () {
        console.error = this.mockFn();
    };
    return MockError;
}(BaseMock));
exports.MockError = MockError;
var MockTrace = /** @class */ (function (_super) {
    __extends(MockTrace, _super);
    function MockTrace() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockTrace.prototype.mock = function () {
        console.trace = this.mockFn();
    };
    return MockTrace;
}(BaseMock));
exports.MockTrace = MockTrace;
var MockConsole = /** @class */ (function (_super) {
    __extends(MockConsole, _super);
    function MockConsole() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockConsole.prototype.mock = function () {
        console.warn = this.mockFn();
        console.log = this.mockFn();
        console.dir = this.mockFn();
        console.debug = this.mockFn();
        console.error = this.mockFn();
        console.trace = this.mockFn();
    };
    return MockConsole;
}(BaseMock));
exports.MockConsole = MockConsole;
