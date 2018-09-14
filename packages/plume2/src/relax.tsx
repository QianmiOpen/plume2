import { fromJS, is } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { PartialQueryLang } from './pql';
import { QueryLang } from './ql';
import Store from './store';
import { isArray, isString } from './type';
import { IMap, IRelaxComponent, IRelaxContext } from './typing';

const relaxCount = {};

/**
 * 通过分析relaxProps构成，来判断@Relax需不需要订阅store的变化
 * @param relaxProps
 */
export const isRxRelaxProps = (relaxProps: Object): boolean => {
  for (let prop in relaxProps) {
    const propValue = relaxProps[prop];
    if (
      (isString(propValue) && prop !== 'viewAction') ||
      isArray(propValue) ||
      propValue instanceof QueryLang
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Relax Container
 * 负责注入relaxProps属性对应的值
 * @param Wrapper
 */
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

    constructor(props: Object, context: IRelaxContext<Store>) {
      super(props);
      this._isMounted = false;
      this.state = { storeState: {} };

      //判断是不是需要响应store的状态变化
      this._isNeedRxStore = isRxRelaxProps(Relax.relaxProps);
      if (this._isNeedRxStore) {
        context._plume$Store.subscribe(this._handleStoreChange);
      }

      //will drop on production env
      if (process.env.NODE_ENV != 'production') {
        if ((context['_plume$Store'] as any)._opts.debug) {
          const count = relaxCount[Relax.displayName];
          if (typeof count != 'number') {
            relaxCount[Relax.displayName] = 1;
          } else {
            relaxCount[Relax.displayName]++;
          }

          if (count > 10) {
            console.warn(
              `you have to many ${
                Relax.displayName
              } component, May be effect performance!`
            );
          }
        }
      }
    }
    //relax related props
    props: Object;
    //current context
    context: { _plume$Store: Store };

    private _relaxProps: Object;
    private _isMounted: boolean;
    private _isNeedRxStore: boolean;

    componentWillMount() {
      this._isMounted = false;
      //计算一次relaxProps
      this._relaxProps = this._computeRelaxProps();

      //will drop on production env
      if (process.env.NODE_ENV != 'production') {
        if ((this.context['_plume$Store'] as any)._opts.debug) {
          const relaxData = relaxProps => {
            const data = {};
            //filter viewAction and function
            for (let prop in relaxProps) {
              if (
                prop === 'viewAction' ||
                typeof relaxProps[prop] === 'function'
              ) {
                continue;
              }
              data[prop] = relaxProps[prop];
            }
            return data;
          };

          console.groupCollapsed &&
            console.groupCollapsed(
              `${Relax.displayName} will mount rx store: ${
                this._isNeedRxStore
              } 🚀 `
            );
          console.log('props:|>', JSON.stringify(this.props, null, 2));
          console.log(
            'relaxProps:|>',
            JSON.stringify(relaxData(this._relaxProps), null, 2)
          );
          console.groupEnd && console.groupEnd();
        }
      }
    }

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUpdate() {
      this._isMounted = false;
    }

    componentDidUpdate() {
      this._isMounted = true;
    }

    shouldComponentUpdate(nextProps) {
      const newRelaxProps = this._computeRelaxProps();

      if (
        !is(fromJS(this.props), fromJS(nextProps)) ||
        !is(fromJS(this._relaxProps), fromJS(newRelaxProps))
      ) {
        this._relaxProps = newRelaxProps;

        if (process.env.NODE_ENV != 'production') {
          if ((this.context['_plume$Store'] as any)._opts.debug) {
            const relaxData = relaxProps => {
              const data = {};
              for (let prop in relaxProps) {
                if (
                  prop === 'viewAction' ||
                  typeof relaxProps[prop] == 'function'
                ) {
                  continue;
                }
                data[prop] = relaxProps[prop];
              }
              return data;
            };
            console.groupCollapsed &&
              console.groupCollapsed(
                `${Relax.displayName} will update rx store ${
                  this._isNeedRxStore
                } 🚀`
              );
            console.log('props:|>', JSON.stringify(this.props, null, 2));
            console.log(
              'relaxProps:|>',
              JSON.stringify(relaxData(this._relaxProps), null, 2)
            );
            console.groupEnd && console.groupEnd();
          }
        }
        return true;
      } else {
        return false;
      }
    }

    componentWillUnmount() {
      if (this._isNeedRxStore) {
        this.context['_plume$Store'].unsubscribe(this._handleStoreChange);
      }

      if (process.env.NODE_ENV != 'production') {
        if ((this.context['_plume$Store'] as any)._opts.debug) {
          relaxCount[Relax.displayName]--;
        }
      }
    }

    render() {
      return <Wrapper {...this.props} relaxProps={this._relaxProps} />;
    }

    _computeRelaxProps() {
      //dev check
      if (process.env.NODE_ENV != 'production') {
        if (!Wrapper.relaxProps) {
          console.warn(
            `😓 ${
              Relax.displayName
            } could not find any static relaxProps, Please remove @Relex!!!`
          );
        }
      }

      const relaxProps = {};
      const staticRelaxProps = Relax.relaxProps;
      const store: Store = this.context['_plume$Store'];

      for (let propName in staticRelaxProps) {
        //prop的属性值
        const propValue = staticRelaxProps[propName];
        //判断注入的属性是不是viewAction,如果是就直接将store中的viewAction注入
        if (propValue === 'viewAction') {
          //warning...
          if (process.env.NODE_ENV != 'production') {
            if (!store.viewAction) {
              console.error(
                `store can not find viewAction, please bind viewAction first`
              );
            }
          }
          relaxProps[propName] = store.viewAction;
        } else if (
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
        this.setState({ storeState: state });
      }
    };
  };

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }
}
