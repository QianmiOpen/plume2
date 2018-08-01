import React from 'react';
import Store from './store';
import { IOptions } from './typing';
export declare type TStore = new (...args: Array<any>) => Store;
/**
 * StoreProvider连接ReactUI和Store
 * @param AppStore
 * @param opts
 */
export default function StoreProvider(AppStore: TStore, opts?: IOptions): (Base: React.ComponentClass<{}>) => any;
