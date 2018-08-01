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
import { QueryLang } from './ql';
export declare class PartialQueryLang {
    constructor(lang: (...args: any[]) => QueryLang);
    private _lang;
    /**
     * 绑定bigQuery
     * 允许嵌套QL不允许嵌套PQL
     * @param bigQuery
     */
    partialQL(bigQuery: Function): (...args: any[]) => any;
}
export declare const PQL: (lang: (...args: any[]) => QueryLang) => PartialQueryLang;
