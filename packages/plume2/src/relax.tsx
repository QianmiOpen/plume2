import { fromJS, is } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { getDisplayName, isNeedRxStoreChange } from './helper';
import { PartialQueryLang } from './pql';
import { QueryLang } from './ql';
import Store from './store';
import { isArray, isString } from './type';
import { IMap, IRelaxComponent, IRelaxContext } from './typing';

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
      //will drop on production env
      //优化开发体验，在relax判断是不是context是不是有绑定的store
      //如果没有提示用户需要在顶层的React组件加上StoreProvider
      if (process.env.NODE_ENV != 'production') {
        require('./helper/relax-dev-helper').ifNoStoreInContext(context);
      }

      this._isMounted = false;
      this.state = { storeState: {} };
      this._isDebug = (context['_plume$Store'] as any)._opts.debug;

      //will drop on production env
      //如果一个页面有太多的relaxcontainer说明设计上不是特别合理
      //比如在一个子列表中大量使用relax
      if (process.env.NODE_ENV != 'production' && this._isDebug) {
        require('./helper/relax-dev-helper').ifTooManyRelaxContainer.watch(
          Relax
        );
      }
      //=======================END===============================

      //判断是不是需要响应store的状态变化
      this._isNeedRxStore = isNeedRxStoreChange(Relax.relaxProps);
      if (this._isNeedRxStore) {
        context._plume$Store.subscribe(this._handleStoreChange);
      }
    }

    props: Object;
    context: { _plume$Store: Store };
    _relaxProxy: Object;

    private _isDebug: boolean;
    private _relaxProps: Object;
    private _isMounted: boolean;
    private _isNeedRxStore: boolean;

    componentWillMount() {
      this._isMounted = false;
      //计算一次relaxProps
      this._relaxProps = this._computeRelaxProps();

      //=======================AOT===============================
      //格式化props输出，方便在devtool检出注入数据
      if (process.env.NODE_ENV != 'production' && this._isDebug) {
        require('./helper/relax-dev-helper').outputRelaxProps({
          Relax,
          relax: this,
          lifecycle: 'willMount'
        });
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

        //=======================AOT===============================
        //格式化props输出，方便在devtool检出注入数据
        if (process.env.NODE_ENV != 'production' && this._isDebug) {
          require('./helper/relax-dev-helper').outputRelaxProps({
            Relax,
            relax: this,
            lifecycle: 'willUpdate'
          });
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

      if (process.env.NODE_ENV != 'production' && this._isDebug) {
        require('./helper/relax-dev-helper').ifTooManyRelaxContainer.unwatch(
          Relax
        );
      }
    }

    render() {
      return (
        <Wrapper
          ref={relaxProxy => (this._relaxProxy = relaxProxy)}
          {...this.props}
          relaxProps={this._relaxProps}
        />
      );
    }

    _computeRelaxProps() {
      const relaxProps = {};
      let staticRelaxProps = Relax.relaxProps;
      const store: Store = this.context['_plume$Store'];

      //如果relaxProps是Array，将数据格式做一些处理，来支撑这个格式
      //static relaxProps = [
      // 'stateName1',
      // 'stateName2',
      // 'viewAction',
      //   {
      //     stateName3Alias: ['goodsList', 1, "goodsName"],
      //       helloQL,
      //       worldQL,
      //   },
      //  ]
      if (isArray(staticRelaxProps)) {
        staticRelaxProps = (staticRelaxProps as Array<any>).reduce(
          (preVal, curVal) => {
            if (isString(curVal)) {
              preVal[curVal] = curVal;
            } else {
              preVal = { ...preVal, ...curVal };
            }
            return preVal;
          },
          {}
        );
      }

      for (let propName in staticRelaxProps) {
        //prop的属性值
        const propValue = staticRelaxProps[propName];
        //判断注入的属性是不是viewAction,如果是就直接将store中的viewAction注入
        if (propValue === 'viewAction') {
          relaxProps[propName] = store.viewAction;
          //============AOT==================
          if (process.env.NODE_ENV != 'production' && this._isDebug) {
            require('./helper/relax-dev-helper').ifNoViewActionInStore(store);
          }
        }
        //注入store中的值，或者QL对应的值
        else if (
          isString(propValue) ||
          isArray(propValue) ||
          propValue instanceof QueryLang
        ) {
          relaxProps[propName] = store.bigQuery(propValue);
        }
        //注入store中的方法
        else if (typeof propValue === 'function') {
          //如果该属性值是函数类型，注入store的method
          const storeMethod = store[propName];
          relaxProps[propName] = storeMethod || propValue;

          //=========AOT==========================
          if (process.env.NODE_ENV != 'production') {
            !storeMethod &&
              console.warn(`store can not find '${propName}' method.`);
          }
        }
        //注入PartialQueryLang的值
        else if (propValue instanceof PartialQueryLang) {
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
}
