export type TLang = Array<any>;

export class RxLang {
  constructor(name: string, lang: TLang) {
    this._name = name;
    this._lang = lang;
  }

  private _name: string;
  private _lang: TLang;

  name() {
    return this._name;
  }

  lang() {
    return this._lang;
  }
}

export function RL(name: string, lang: TLang) {
  return new RxLang(name, lang);
}
