"use strict";
const ql_1 = require("./ql");
const is_array_1 = require("./util/is-array");
const is_string_1 = require("./util/is-string");
class DynamicQueryLang {
    constructor(name, lang) {
        this._ctx = {};
        this._ql = ql_1.QL(name, lang);
    }
    analyserLang(ql) {
        //获取语法结构
        let lang = ql.lang();
        for (let i = 0, len = lang.length - 1; i < len; i++) {
            //获取当前的路径
            let path = lang[i];
            if (is_string_1.default(path) && path[0] === '$') {
                //重新赋值
                lang[i] = this._ctx[path.substring(1)];
            }
            else if (is_array_1.default(path)) {
                for (let j = 0, len = path.length; j < len; j++) {
                    let path = lang[i][j];
                    if (is_string_1.default(path) && path[0] === '$') {
                        //重新赋值
                        lang[i][j] = this._ctx[path.substring(1)];
                    }
                }
            }
            else if (path instanceof DynamicQueryLang) {
                //递归一次
                this.analyserLang(path._ql);
                lang[i] = path._ql;
            }
        }
    }
    withContext(ctx) {
        this._ctx = ctx;
        return this;
    }
    ql() {
        this.analyserLang(this._ql);
        return this._ql;
    }
}
exports.DynamicQueryLang = DynamicQueryLang;
function DQL(name, lang) {
    return new DynamicQueryLang(name, lang);
}
exports.DQL = DQL;
