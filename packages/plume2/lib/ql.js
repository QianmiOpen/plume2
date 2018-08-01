"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = 0;
var QueryLang = /** @class */ (function () {
    function QueryLang(name, lang) {
        this._id = ++uuid;
        this._name = name;
        this._lang = lang;
    }
    QueryLang.prototype.id = function () {
        return this._id;
    };
    QueryLang.prototype.name = function () {
        return this._name;
    };
    QueryLang.prototype.lang = function () {
        return this._lang;
    };
    QueryLang.prototype.setLang = function (lang) {
        this._lang = lang;
        return this;
    };
    return QueryLang;
}());
exports.QueryLang = QueryLang;
function QL(name, lang) {
    return new QueryLang(name, lang);
}
exports.QL = QL;
