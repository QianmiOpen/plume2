/**
 * const helloPQL = PQL(index => QL([
 *   ['users', index, 'name'],
 *   (name)=>name
 * ])
 *
 * @Relax
 * class HellQL extends React.Component {
 *   static relaxProps = {
 *      name: helloPQL
 *   }
 *
 *   render() {
 *    const {name} = this.relaxProps;
 *    const username = name(1)
 *   }
 * }
 */
import { QueryLang } from "./ql";

export class PartialQueryLang {
  constructor(name: string, lang: (...args: any[]) => QueryLang) {
    this._name = name;
    this._lang = lang;
  }

  private _name: string;
  private _lang: (...args: any[]) => QueryLang;

  name() {
    return this._name;
  }

  /**
   * 绑定bigQuery
   * 允许嵌套QL不允许嵌套PQL
   * @param bigQuery
   */
  partialQL(bigQuery: Function) {
    return (...args: any[]) => {
      return bigQuery(this._lang(...args));
    };
  }
}

export const PQL = (name: string, lang: (...args: any[]) => QueryLang) => {
  return new PartialQueryLang(name, lang);
};
