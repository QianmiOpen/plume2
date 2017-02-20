import { QL, QueryLang } from './ql'
import isArray from './util/is-array'
import isstring from './util/is-string'

export class DynamicQueryLang {
  private _ctx: Object;
  private _name: string;
  private _lang: Array<any>;
  private _ql: QueryLang;

  constructor(name: string, lang: Array<any>) {
    this._ctx = {}
    this._name = name;
    this._lang = lang;
  }

  /**
   * 暂时不支持DQL的递归， 这解析起来非常复杂，性能也不好
   * 思维定式，slice之前去slice基本数据都非常ok，做了值拷贝
   * 但是slice一个对象数组的时候一定小心，slice前后的数组包含的对象还是同一个
   */
  analyserLang(dLang: Array<any>) {
    const lang = []

    for (let i = 0, len = dLang.length; i < len; i++) {
      let path = dLang[i];

      if (isstring(path)) {
        lang[i] = path[0] === '$' ? this._ctx[path.substring(1)] : path
      } else if (isArray(path)) {
        lang[i] = []
        for (let j = 0, len = path.length; j < len; j++) {
          let field = dLang[i][j];
          lang[i][j] = (isstring(field) && field[0] === '$') ? this._ctx[field.substring(1)] : field
        }
      } else {
        lang[i] = path
      }
    }

    return lang
  }


  withContext(ctx: Object) {
    this._ctx = ctx
    return this
  }

  ql() {
    const lang = this.analyserLang(this._lang)
    if (!this._ql) {
      this._ql = new QueryLang(this._name, lang)
    } else {
      this._ql.setLang(lang)
    }
    return this._ql
  }
}

export class DQLVO {
  name: string;
  lang: Array<any>;

  constructor(name: string, lang: Array<any>) {
    this.name = name
    this.lang = lang
  }
}

export function DQL(name: string, lang: Array<any>) {
  return new DQLVO(name, lang)
}