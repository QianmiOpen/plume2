import { Map } from 'immutable';
import { ViewAction } from './view-action';

/**
 * Immutable的map类型
 */
export type IMap = Map<string, any>;

/**
 * actor的路由类型
 */
export type TRoute = {
  [name: string]: (state: IMap, params?: any) => IMap;
};

/**
 * Relax容器组件的上下文类型
 */
export interface IRelaxContext<Store> {
  _plume$Store: Store;
}

/**
 * Relax容器组件的props类型
 */
export interface IRelaxProps {
  relaxProps?: Object;
  [name: string]: any;
}

/**
 * Relax容器组件的类型
 */
export interface IRelaxComponent extends React.ComponentClass<IRelaxProps> {
  relaxProps?: Object;
}

/**
 * Store数据容器的参数配置类型
 */
export interface IOptions {
  debug?: boolean;
  [name: string]: any;
}

export interface IViewActionMapper {
  [name: string]: ViewAction;
}

export type TViewAction<T> = {
  [K in keyof T]: T[K] extends new (...args: Array<any>) => infer R ? R : any
};
