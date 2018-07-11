export type Lang = Array<any>;

let uuid = 0;

export class QueryLang {
  constructor(name: string, lang: Lang) {
    this._id = ++uuid;
    this._name = name;
    this._lang = lang;
  }

  private _id: number;
  private _name: string;
  private _lang: Lang;

  id() {
    return this._id;
  }

  name() {
    return this._name;
  }

  lang() {
    return this._lang;
  }

  setLang(lang: Array<any>) {
    this._lang = lang;
    return this;
  }
}

export function QL(name: string, lang: Lang) {
  return new QueryLang(name, lang);
}
