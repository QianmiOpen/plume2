import * as React from 'react'
import Store from './store'
import { QueryLang } from './ql'
import { DynamicQueryLang } from './dql'
import { Map, is, fromJS } from 'immutable'

type IMap = Map<string, any>;

interface RelaxContext {
  _plume$Store: Store
}

export default function RelaxContainer(Wrapper: React.Component): React.Component {
  return class Relax extends React.Component {
    //displayName
    static displayName = `StoreProvider(${getDisplayName(Wrapper)})`;

    //拷贝WrapperComponent的defaultProps
    static defaultProps = Wrapper.defaultProps || {}

    //声明上下文依赖
    static contextTypes = {
      _plume$Store: React.PropTypes.object
    };

    props: Object;
    relaxProps: Object;
    context: Store;
    _isMounted: boolean;

    constructor(props: Object, context: RelaxContext) {
      super(props)
      this._isMounted = false
      //提前绑定事件，为了争取父子有序
      context._plume$Store.subscribe(this._handleStoreChange)
    }

    componentWillMount() {
      //先计算一次relaxProps
      this.relaxProps = this.computeProps(this.props)
      this._isMounted = false
    }

    componentDidMount() {
      this._isMounted = true
    }

    componentWillUpdate() {
      this._isMounted = false
    }

    componentDidUpdate() {
      this._isMounted = true
    }

    shouldComponentUpdate(nextProps) {
      //如果前后两次props的数量都不一致，直接刷新
      if (Object.keys(nextProps).length != Object.keys(this.props).length) {
        return true
      }

      const newRelaxProps = this.computeProps(nextProps)
      if (is(fromJS(this.relaxProps), fromJS(newRelaxProps))) {
        return false
      }

      this.relaxProps = newRelaxProps
      return true
    }

    componentWillUnmount() {
      this.context.unsubscribe(this._handleStoreChange)
    }

    render() {
      return <Wrapper {...this.props} {...this.relaxProps} />
    }

    computeProps(props) {
      const relaxProps = {}
      const store: Store = this.context['_plume$Store']
      const dqlList = {}

      for (let propName in props) {
        const propValue = props[propName]
        //先取默认值
        relaxProps[propName] = propValue

        //属性值如果是function，直接根据名称注入store中的方法
        if (typeof (propValue) === 'function') {
          relaxProps[propName] = store[propName]
        }

        //是不是源于store中的state
        else if (_isNotValidValue(store.state().get(propName))) {
          relaxProps[propName] = store.state().get(propName)
        }

        //是不是ql
        else if (propValue instanceof QueryLang) {
          relaxProps[propName] = store.bigQuery(propValue)
        }

        //是不是dql
        else if (propValue instanceof DynamicQueryLang) {
          dqlList[propName] = propValue
        }
      }

      //计算dql
      for (let propName in dqlList) {
        let ql = (dqlList[propName] as DynamicQueryLang).withContext(relaxProps).ql()
        relaxProps[propName] = store.bigQuery(ql)
      }

      return relaxProps
    }

    _handleStoreChange = (state: IMap) => {
      if (this._isMounted) {
        (this as any).setState((preState) => state)
      }
    }
  }

  function _isNotValidValue(v: any) {
    return (typeof (v) != 'undefined' && v != null)
  }

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
  }
}