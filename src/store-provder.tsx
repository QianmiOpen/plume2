import * as React from 'react';
import { Map } from 'immutable';
import Store from './store';
import { IMap, IOptions } from './typing';
export type TStore = typeof Store;

export default function StoreProvider(AppStore: TStore, opts?: IOptions) {
  /**
   * 获取组件的displayName便于react-devtools的调试
   * @param WrappedComponent 
   */
  const getDisplayName = WrappedComponent =>
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return function wrapper(Base: React.ComponentClass): any {
    return class WrapperComponent extends Base {
      store: Store;
      state: Object;
      private _isMounted: boolean;

      static displayName = `StoreProvider(${getDisplayName(Base)})`;

      static childContextTypes = { _plume$Store: React.PropTypes.object };

      getChildContext: Function = (): Object => {
        return { _plume$Store: this.store };
      };

      constructor(props: Object) {
        super(props);
        this._isMounted = false;
        this.store = new AppStore(opts || { debug: false });

        this.state = { ...this.state, ...this.store.state().toObject() };

        this.store.subscribe(this._handleStoreChange);
      }

      componentWillMount() {
        super.componentWillMount && super.componentWillMount();
        this._isMounted = false;

        //will drop on production env
        if (process.env.NODE_ENV != 'production') {
          if ((this.store as any)._opts.debug) {
            console.log(`${WrapperComponent.displayName} will mount 🚀`);
          }
        }
      }

      componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        this._isMounted = true;
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
      }

      render() {
        return super.render();
      }

      _handleStoreChange = (state: IMap) => {
        //will drop on production env
        if (process.env.NODE_ENV != 'production') {
          if ((this.store as any)._opts.debug) {
            console.log(`\n${WrapperComponent.displayName} will update 🚀`);
          }
        }

        this.setState(state.toObject());
      };
    };
  };
}
