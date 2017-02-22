"use strict";
const ql_1 = require("./ql");
const is_array_1 = require("./util/is-array");
const is_string_1 = require("./util/is-string");
class DynamicQueryLang {
    constructor(name, lang) {
        this._ctx = {};
        this._name = name;
        this._lang = lang;
    }
    analyserLang(dLang) {
        const lang = [];
        for (let i = 0, len = dLang.length; i < len; i++) {
            let path = dLang[i];
            if (is_string_1.default(path)) {
                lang[i] = path[0] === '$' ? this._ctx[path.substring(1)] : path;
            }
            else if (is_array_1.default(path)) {
                lang[i] = [];
                for (let j = 0, len = path.length; j < len; j++) {
                    let field = dLang[i][j];
                    lang[i][j] = (is_string_1.default(field) && field[0] === '$')
                        ? this._ctx[field.substring(1)]
                        : field;
                }
            }
            else if (path instanceof DynamicQueryLang) {
                //each time, we create a new QueryLang
                //in this case, we don't need any cache
                lang[i] = new ql_1.QueryLang(`${path._name}2QL`, this.analyserLang(path._lang));
            }
            else {
                lang[i] = path;
            }
        }
        return lang;
    }
    withContext(ctx) {
        this._ctx = ctx;
        return this;
    }
    name() {
        return this._name;
    }
    lang() {
        return this._lang;
    }
}
exports.DynamicQueryLang = DynamicQueryLang;
function DQL(name, lang) {
    return new DynamicQueryLang(name, lang);
}
exports.DQL = DQL;
