import * as React from 'react'
import { Map, is, fromJS } from 'immutable'
import isArray from './util/is-array'
import isString from './util/is-string'
import Store from './store'
import { QueryLang, DynamicQueryLang } from './ql'

type IMap = Map<string, any>;

interface RelaxContext {
  _plume$Store: Store
}

export default function RelaxContainer(Wrapper: React.Component): React.Component {
  return class Relax extends React.Component {
    //displayName
    static displayName = `Relax(${getDisplayName(Wrapper)})`;

    //拷贝WrapperComponent的defaultProps
    static defaultProps = Wrapper.defaultProps || {};
    //拷贝WrapperComponent的relaxProps
    //注入和store关联的数据和方法
    static relaxProps = Wrapper.relaxProps || {};

    //声明上下文依赖
    static contextTypes = {
      _plume$Store: React.PropTypes.object
    };

    props: Object;
    state: Object;
    relaxProps: Object;
    context: Store;
    _dql2QL: { [name: string]: QueryLang };
    _isMounted: boolean;

    constructor(props: Object, context: RelaxContext) {
      super(props)
      this._isMounted = false
      this._dql2QL = {}
      this.state = {
        storeState: fromJS({})
      }
      //提前绑定事件，为了争取父子有序
      context._plume$Store.subscribe(this._handleStoreChange)
    }

    componentWillMount() {
      this._isMounted = false
      //计算一次relaxProps
      this.relaxProps = this.computeRelaxProps(this.props)

      //will drop on production env       
      if (process.env.NODE_ENV != 'production') {
        if (this.context['_plume$Store']._opts.debug) {
          console.groupCollapsed && console.groupCollapsed(`${Relax.displayName} will mount 🚀`)
          console.log('props:|>', JSON.stringify(this.props, null, 2))
          console.log('relaxProps:|>', JSON.stringify(this.relaxProps, null, 2))
          console.groupEnd && console.groupEnd()
        }
      }
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
      const newRelaxProps = this.computeRelaxProps(nextProps)

      if (
        !is(fromJS(this.props), fromJS(nextProps)) ||
        !is(fromJS(this.relaxProps), fromJS(newRelaxProps))) {
        this.relaxProps = newRelaxProps

        if (process.env.NODE_ENV != 'production') {
          if (this.context['_plume$Store']._opts.debug) {
            console.groupCollapsed && console.groupCollapsed(`${Relax.displayName} will update 🚀`)
            console.log('props:|>', JSON.stringify(this.relaxProps, null, 2))
            console.log('relaxProps:|>', JSON.stringify(this.relaxProps, null, 2))
            console.groupEnd && console.groupEnd()
          }
        }

        return true
      } else {
        return false
      }
    }

    componentWillUnmount() {
      (this.context['_plume$Store'] as Store).unsubscribe(this._handleStoreChange)
    }

    render() {
      return <Wrapper {...this.props} relaxProps={this.relaxProps} />
    }

    computeRelaxProps(props) {
      //dev check
      if (process.env.NODE_ENV != 'production') {
        if (!Wrapper.relaxProps) {
          console.warn(`${Relax.displayName} could not find any static relaxProps!!!😅`)
          return {}
        }
      }

      const relaxProps = {}
      const staticRelaxProps = Relax.relaxProps
      const dqlMap = {} as { [name: string]: DynamicQueryLang }
      const store: Store = this.context['_plume$Store']

      for (let propName in staticRelaxProps) {
        //prop的属性值
        const propValue = staticRelaxProps[propName]

        //如果是字符串，注入store's state
        if (isString(propValue)) {
          relaxProps[propName] = store.state().get(propValue)
        }

        //如果是数组，直接注入state's state
        else if (isArray(propValue)) {
          relaxProps[propName] = store.state().getIn(propValue)
        }

        //如果该属性值是函数类型，注入store的method
        else if (typeof (propValue) === 'function') {
          const storeMethod = store[propName]
          relaxProps[propName] = storeMethod || propValue
          //warning...
          if (process.env.NODE_ENV != 'production') {
            if (!storeMethod) {
              console.warn(`store can not find '${propName}' method.`)
            }
          }
        }

        //如果是querylang
        else if (propValue instanceof QueryLang) {
          relaxProps[propName] = store.bigQuery(propValue)
        }

        //是不是dql
        else if (propValue instanceof DynamicQueryLang) {
          if (!this._dql2QL[propName]) {
            //根据DynamicQueryLang保存一份QL
            //先用DQL的lang来填充QL
            //后面会根据Dynamic的动态的计算lang
            this._dql2QL[propName] = new QueryLang(
              propValue.name(),
              propValue.lang()
            )
          }
          dqlMap[propName] = propValue
        }
      }

      //计算dql
      for (let propName in dqlMap) {
        const dql = dqlMap[propName]
        const lang = dql.withContext(props).analyserLang(dql.lang())
        const ql = this._dql2QL[propName].setLang(lang)
        relaxProps[propName] = store.bigQuery(ql)
      }

      return relaxProps
    }

    _handleStoreChange = (state: IMap) => {
      if (this._isMounted) {
        (this as any).setState({
          storeState: state
        })
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