import { Map } from 'immutable'
import * as React from 'react'

export = plume2

declare namespace plume2 {
  export type IMap = Map<string, any>
  export type Handler = (state: IMap) => void;

  export interface IOptions {
    debug?: boolean;
  }

  export interface StorePath {
    path: string | Array<string | number>;
    defaultValue: any;
  }

  export function storePath(path: string | Array<string | number>, defaultValue: any): StorePath

  export interface StoreMethod {
    methodName: string;
    defaultValue: () => void;
  }

  export function storeMethod(methodName: string, defaultValue?: () => void): StoreMethod;

  export class Actor {
    defaultState(): Object;
  }

  export class Store {
    constructor(props?: IOptions);

    dispatch(msg: string, params?: any): IMap;

    transaction(cb: () => void): void;

    bindActor(): Array<Actor>;

    bigQuery(ql: QueryLang, params: { debug?: boolean }): any;

    state(): IMap;

    subscribe(cb: Handler): void;

    unsubscribe(cb: Handler): void;
  }

  export class QueryLang {
    constructor(name: string, lang: Array<any>);

    id(): number;

    name(): string;

    lang(): Array<any>;
  }

  export function QL(
    name: string,
    lang: Array<any>
  ): QueryLang;

  interface Emitter {
    on(type: string, handler: Handler): void;
    off(type: string, handler: Handler): void;
    emit(type: string, event?: any): void;
  }

  export const msg: Emitter;

  export function Action(msg: string): Function;

  export function Relax<TFunction extends React.ComponentClass<any>>(
    target: TFunction
  ): TFunction;

  type TStore = typeof Store
  type Wrapper<IProps> = React.ComponentClass<IProps>;

  export function StoreProvider<IProps>(
    AppStore: TStore,
    opts?: IOptions
  ): (Base: Wrapper<IProps>) => Wrapper<IProps>;
}