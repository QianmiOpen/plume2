"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function StrEnum() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (typeof args[0] === 'string') {
        var result = {};
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
            var a = args_1[_a];
            result[a] = a;
        }
        return result;
    }
    else {
        return args[0];
    }
}
exports.default = StrEnum;
