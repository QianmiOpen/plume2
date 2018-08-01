"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PartialQueryLang = /** @class */ (function () {
    function PartialQueryLang(lang) {
        this._lang = lang;
    }
    /**
     * 绑定bigQuery
     * 允许嵌套QL不允许嵌套PQL
     * @param bigQuery
     */
    PartialQueryLang.prototype.partialQL = function (bigQuery) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return bigQuery(_this._lang.apply(_this, args));
        };
    };
    return PartialQueryLang;
}());
exports.PartialQueryLang = PartialQueryLang;
exports.PQL = function (lang) {
    return new PartialQueryLang(lang);
};
