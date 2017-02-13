type Lang = Array<any>;

let id = 0;

class QueryLang {
  private _id: number;
  private _name: string;
  private _lang: Lang;

  constructor(name: string, lang: Lang) {
    this._id = ++id
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
}

//expose
export default function QL(name: string, lang: Lang) {
  return new QueryLang(name, lang)
}