import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Map, is, fromJS } from 'immutable';
import { isArray, isString } from './type';
import Store from './store';
import { QueryLang } from './ql';
import { IMap, IRelaxContext, IRelaxComponent } from './typing';
import { PartialQueryLang } from './pql';

export default function RelaxContainer(Wrapper: IRelaxComponent): any {
  return class Relax extends React.Component {
    //displayName
    static displayName = `Relax(${getDisplayName(Wrapper)})`;

    //拷贝WrapperComponent的defaultProps
    static defaultProps = Wrapper.defaultProps || {};
    //拷贝WrapperComponent的relaxProps
    //注入和store关联的数据和方法
    static relaxProps = Wrapper.relaxProps || {};
    //声明上下文依赖
    static contextTypes = { _plume$Store: PropTypes.object };

    props: Object;
    state: Object;
    relaxProps: Object;
    context: { _plume$Store: Store };

    private _dql2QL: { [name: string]: QueryLang };
    private _isMounted: boolean;

    constructor(props: Object, context: IRelaxContext<Store>) {
      super(props);
      this._isMounted = false;
      this._dql2QL = {};
      this.state = { storeState: fromJS({}) };
      //提前绑定事件，为了争取父子有序
      context._plume$Store.subscribe(this._handleStoreChange);
    }

    componentWillMount() {
      this._isMounted = false;
      //计算一次relaxProps
      this.relaxProps = this.computeRelaxProps(this.props);

      //will drop on production env
      if (process.env.NODE_ENV != 'production') {
        if ((this.context['_plume$Store'] as any)._opts.debug) {
          console.groupCollapsed &&
            console.groupCollapsed(`${Relax.displayName} will mount 🚀`);
          console.log('props:|>', JSON.stringify(this.props, null, 2));
          console.log(
            'relaxProps:|>',
            JSON.stringify(this.relaxProps, null, 2)
          );
          console.groupEnd && console.groupEnd();
          console.time(`${Relax.displayName} render`);
        }
      }
    }

    componentDidMount() {
      if (process.env.NODE_ENV !== 'production') {
        if ((this.context['_plume$Store'] as any)._opts.debug) {
          console.timeEnd(`${Relax.displayName} render`);
        }
      }

      this._isMounted = true;
    }

    componentWillUpdate() {
      this._isMounted = false;
    }

    componentDidUpdate() {
      if (process.env.NODE_ENV !== 'production') {
        if ((this.context['_plume$Store'] as any)._opts.debug) {
          console.timeEnd(`${Relax.displayName} re-render`);
        }
      }

      this._isMounted = true;
    }

    shouldComponentUpdate(nextProps) {
      if (process.env.NODE_ENV !== 'production') {
        if ((this.context['_plume$Store'] as any)._opts.debug) {
          console.time(`${Relax.displayName} re-render`);
        }
      }

      const newRelaxProps = this.computeRelaxProps(nextProps);

      if (
        !is(fromJS(this.props), fromJS(nextProps)) ||
        !is(fromJS(this.relaxProps), fromJS(newRelaxProps))
      ) {
        this.relaxProps = newRelaxProps;

        if (process.env.NODE_ENV != 'production') {
          if ((this.context['_plume$Store'] as any)._opts.debug) {
            console.groupCollapsed &&
              console.groupCollapsed(`${Relax.displayName} will update 🚀`);
            console.log('props:|>', JSON.stringify(this.relaxProps, null, 2));
            console.log(
              'relaxProps:|>',
              JSON.stringify(this.relaxProps, null, 2)
            );
            console.groupEnd && console.groupEnd();
          }
        }
        return true;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          if ((this.context['_plume$Store'] as any)._opts.debug) {
            console.timeEnd(`${Relax.displayName} re-render`);
          }
        }
        return false;
      }
    }

    componentWillUnmount() {
      this.context['_plume$Store'].unsubscribe(this._handleStoreChange);
    }

    render() {
      return <Wrapper {...this.props} relaxProps={this.relaxProps} />;
    }

    computeRelaxProps(props) {
      //dev check
      if (process.env.NODE_ENV != 'production') {
        if (!Wrapper.relaxProps) {
          console.warn(
            `${Relax.displayName} could not find any static relaxProps!!!😅`
          );
          return {};
        }
      }

      const relaxProps = {};
      const staticRelaxProps = Relax.relaxProps;
      const store: Store = this.context['_plume$Store'];

      for (let propName in staticRelaxProps) {
        //prop的属性值
        const propValue = staticRelaxProps[propName];

        if (
          isString(propValue) ||
          isArray(propValue) ||
          propValue instanceof QueryLang
        ) {
          relaxProps[propName] = store.bigQuery(propValue);
        } else if (typeof propValue === 'function') {
          //如果该属性值是函数类型，注入store的method
          const storeMethod = store[propName];
          relaxProps[propName] = storeMethod || propValue;
          //warning...
          if (process.env.NODE_ENV != 'production') {
            if (!storeMethod) {
              console.warn(`store can not find '${propName}' method.`);
            }
          }
        } else if (propValue instanceof PartialQueryLang) {
          relaxProps[propName] = propValue.partialQL(
            this.context._plume$Store.bigQuery
          );
        }
      }

      return relaxProps;
    }

    _handleStoreChange = (state: IMap) => {
      if (this._isMounted) {
        (this as any).setState({
          storeState: state
        });
      }
    };
  };

  function _isNotValidValue(v: any) {
    return typeof v != 'undefined' && v != null;
  }

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }
}
