import isArray from './util/is-array'
import isstring from './util/is-string'

type Lang = Array<any>;

let uuid = 0;

export class QueryLang {
  private _id: number;
  private _name: string;
  private _lang: Lang;

  constructor(name: string, lang: Lang) {
    this._id = ++uuid
    this._name = name
    this._lang = lang
  }

  id() {
    return this._id
  }

  name() {
    return this._name
  }

  lang() {
    return this._lang
  }

  setLang(lang: Array<any>) {
    this._lang = lang
    return this
  }
}

export class DynamicQueryLang {
  private _ctx: Object;
  private _name: string;
  private _lang: Array<any>;

  constructor(name: string, lang: Array<any>) {
    this._ctx = {}
    this._name = name;
    this._lang = lang;
  }

  //parse DQL's lang
  //return QL's lang
  analyserLang(dLang: Array<any>): Array<any> {
    const lang = []

    for (let i = 0, len = dLang.length; i < len; i++) {
      let path = dLang[i];

      if (isstring(path)) {
        lang[i] = path[0] === '$' ? this._ctx[path.substring(1)] : path
      } else if (isArray(path)) {
        lang[i] = []
        for (let j = 0, len = path.length; j < len; j++) {
          let field = dLang[i][j]
          lang[i][j] = (isstring(field) && field[0] === '$')
            ? this._ctx[field.substring(1)]
            : field
        }
      } else if (path instanceof DynamicQueryLang) {
        //each time, we create a new QueryLang
        //in this case, we don't need any cache
        lang[i] = new QueryLang(`${path._name}2QL`, this.analyserLang(path._lang))
      }
      else {
        lang[i] = path
      }
    }

    return lang
  }


  withContext(ctx: Object) {
    this._ctx = ctx
    return this
  }

  name() {
    return this._name
  }

  lang() {
    return this._lang
  }
}


function isDQLLang(lang: Array<any>): boolean {
  //why len - 1? 😝
  for (let i = 0, len = lang.length; i < len - 1; i++) {
    const path = lang[i]
    //如果当前的路径是字符串，直接判断是不是包含'$'
    //如果当前的路径是数组，join之后判断是不是包含'$'
    //如果当前的路径是DynamicLang 直接返回true
    if (isstring(path) && path[0] === '$') {
      return true
    } else if (isArray(path) && path.join('').indexOf('$') != -1) {
      return true
    } else if (path instanceof DynamicQueryLang) {
      return true
    }
  }

  return false
}

//expose
export function QL(name: string, lang: Lang) {
  return (
    isDQLLang(lang)
      ? new DynamicQueryLang(name, lang)
      : new QueryLang(name, lang)
  )
}