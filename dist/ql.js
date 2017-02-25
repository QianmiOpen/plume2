"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_array_1 = require("./util/is-array");
const is_string_1 = require("./util/is-string");
let uuid = 0;
class QueryLang {
    constructor(name, lang) {
        this._id = ++uuid;
        this._name = name;
        this._lang = lang;
    }
    id() {
        return this._id;
    }
    name() {
        return this._name;
    }
    lang() {
        return this._lang;
    }
    setLang(lang) {
        this._lang = lang;
        return this;
    }
}
exports.QueryLang = QueryLang;
class DynamicQueryLang {
    constructor(name, lang) {
        this._ctx = {};
        this._name = name;
        this._lang = lang;
    }
    //parse DQL's lang
    //return DQL's lang
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
                lang[i] = new QueryLang(`${path._name}2QL`, this.analyserLang(path._lang));
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
function isDQLLang(lang) {
    //why len - 1? 😝
    for (let i = 0, len = lang.length; i < len - 1; i++) {
        const path = lang[i];
        //如果当前的路径是字符串，直接判断是不是包含'$'
        //如果当前的路径是数组，join之后判断是不是包含'$'
        //如果当前的路径是DynamicLang 直接返回true
        if (is_string_1.default(path) && path[0] === '$') {
            return true;
        }
        else if (is_array_1.default(path) && path.join('').indexOf('$') != -1) {
            return true;
        }
        else if (path instanceof DynamicQueryLang) {
            return true;
        }
    }
    return false;
}
//expose
function QL(name, lang) {
    return (isDQLLang(lang)
        ? new DynamicQueryLang(name, lang)
        : new QueryLang(name, lang));
}
exports.QL = QL;
