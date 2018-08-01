export declare type Lang = Array<any>;
export declare class QueryLang {
    constructor(name: string, lang: Lang);
    private _id;
    private _name;
    private _lang;
    id(): number;
    name(): string;
    lang(): any[];
    setLang(lang: Array<any>): this;
}
export declare function QL(name: string, lang: Lang): QueryLang;
