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
    /**
     * 暂时不支持DQL的递归， 这解析起来非常复杂，性能也不好
     * 思维定式，slice之前去slice基本数据都非常ok，做了值拷贝
     * 但是slice一个对象数组的时候一定小心，slice前后的数组包含的对象还是同一个
     */
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
                    if (is_string_1.default(field)) {
                        lang[i][j] = field[0] === '$' ? this._ctx[field.substring(1)] : field;
                    }
                }
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
    ql() {
        const lang = this.analyserLang(this._lang);
        if (!this._ql) {
            this._ql = new ql_1.QueryLang(this._name, lang);
        }
        else {
            this._ql.setLang(lang);
        }
        return this._ql;
    }
}
exports.DynamicQueryLang = DynamicQueryLang;
class DQLVO {
    constructor(name, lang) {
        this.name = name;
        this.lang = lang;
    }
}
exports.DQLVO = DQLVO;
function DQL(name, lang) {
    return new DQLVO(name, lang);
}
exports.DQL = DQL;
