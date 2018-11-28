import PropTypes from 'prop-types';
import React from 'react';
import { getDisplayName } from './helper';
import Store from './store';
import { IMap, IOptions } from './typing';

export type TStore = new (...args: Array<any>) => Store;

/**
 * StoreProvider连接ReactUI和Store
 * @param AppStore
 * @param opts
 */
export default function StoreProvider(AppStore: TStore, opts?: IOptions) {
  return function wrapper(Base: React.ComponentClass): any {
    return class WrapperComponent extends Base {
      static displayName = `StoreProvider(${getDisplayName(Base)})`;
      static childContextTypes = { _plume$Store: PropTypes.object };

      getChildContext: Function = (): Object => {
        return { _plume$Store: this.store };
      };

      constructor(props: Object) {
        super(props);

        const cfg = opts || { debug: false };

        if (process.env.NODE_ENV != 'production' && cfg.debug) {
          if (window) {
            const cssRule =
              'color: rgb(249, 162, 34);' +
              'font-size: 40px;' +
              'font-weight: bold;' +
              'text-shadow: 1px 1px 5px rgb(249, 162, 34);' +
              'filter: dropshadow(color=rgb(249, 162, 34), offx=1, offy=1);';
            const version = require('../package.json').version;
            console.log(`%cplume2@${version}🚀`, cssRule);
          }
        }

        this._isMounted = false;
        this.store = new AppStore(cfg);
        this._isDebug = cfg.debug;
        this.state = { ...this.state, ...this.store.state().toObject() };

        this.store.subscribe(this._handleStoreChange);
      }

      store: Store;
      state: Object;
      _isMounted: boolean;
      _isDebug: boolean;

      componentWillMount() {
        super.componentWillMount && super.componentWillMount();
        this._isMounted = false;

        //will drop on production env
        if (process.env.NODE_ENV != 'production' && this._isDebug) {
          console.log(`${WrapperComponent.displayName} will mount 🚀`);
        }
      }

      componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        this._isMounted = true;

        /**
         *优化
         * 不需要每次在Store的构造函数中去
         * if (__DEV__) {window['store'] = this;}
         * 1. 需要额外的去写构造函数
         * 2. 不同的App会覆盖window['store']
         */
        if (process.env.NODE_ENV != 'production' && this._isDebug) {
          const displayName = getDisplayName(Base);
          window['_plume2App'] = window['_plume2App'] || {};
          window['_plume2App'][displayName] = {
            store: this.store
          };
        }
      }

      componentWillUpdate(nextProps, nextState, nextContext) {
        super.componentWillUpdate &&
          super.componentWillUpdate(nextProps, nextState, nextContext);
        this._isMounted = false;
      }

      componentDidUpdate(prevProps, prevState, prevContext) {
        super.componentDidUpdate &&
          super.componentDidUpdate(prevProps, prevState, prevContext);
        this._isMounted = true;
      }

      componentWillUnmount() {
        super.componentWillUnmount && super.componentWillUnmount();
        this.store.unsubscribe(this._handleStoreChange);
        this.store.destroy();

        if (process.env.NODE_ENV != 'production' && this._isDebug) {
          const displayName = getDisplayName(Base);
          delete window['_plume2App'][displayName];
        }
      }

      render() {
        return super.render();
      }

      _handleStoreChange = (state: IMap) => {
        //will drop on production env
        if (process.env.NODE_ENV != 'production' && this._isDebug) {
          console.log(`\n${WrapperComponent.displayName} will update 🚀`);
        }

        this.setState(state.toObject());
      };
    };
  };
}
