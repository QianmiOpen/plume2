import { QL, QueryLang } from './ql'
import isArray from './util/is-array'
import isstring from './util/is-string'

export class DynamicQueryLang {
  private _ctx: Object;
  private _ql: QueryLang;

  constructor(name: string, lang: Array<any>) {
    this._ctx = {}
    this._ql = QL(name, lang)
  }

  analyserLang(ql: QueryLang) {
    //获取语法结构
    let lang = ql.lang();
    for (let i = 0, len = lang.length - 1; i < len; i++) {
      //获取当前的路径
      let path = lang[i];
      if (isstring(path) && path[0] === '$') {
        //重新赋值
        lang[i] = this._ctx[path.substring(1)];
      } else if (isArray(path)) {
        for (let j = 0, len = path.length; j < len; j++) {
          let path = lang[i][j];
          if (isstring(path) && path[0] === '$') {
            //重新赋值
            lang[i][j] = this._ctx[path.substring(1)];
          }
        }
      } else if (path instanceof DynamicQueryLang) {
        //递归一次
        this.analyserLang(path._ql);
        lang[i] = path._ql;
      }
    }
  }


  withContext(ctx: Object) {
    this._ctx = ctx
    return this
  }

  ql() {
    this.analyserLang(this._ql)
    return this._ql
  }
}

export function DQL(name: string, lang: Array<any>) {
  return new DynamicQueryLang(name, lang)
}