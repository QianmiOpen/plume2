import * as React from 'react'
import Store from './store'
import { QueryLang, DynamicQueryLang } from './ql'
import { Map, is, fromJS } from 'immutable'

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

    //声明上下文依赖
    static contextTypes = {
      _plume$Store: React.PropTypes.object
    };

    props: Object;
    relaxProps: Object;
    context: Store;
    _dql2QL: { [name: string]: QueryLang };
    _isMounted: boolean;

    constructor(props: Object, context: RelaxContext) {
      super(props)
      this._isMounted = false
      this._dql2QL = {}
      //提前绑定事件，为了争取父子有序
      context._plume$Store.subscribe(this._handleStoreChange)
    }

    componentWillMount() {
      //先计算一次relaxProps
      this.relaxProps = this.computeProps(this.props)
      this._isMounted = false

      if (process.env.NODE_ENV != 'production') {
        if (this.context['_plume$Store']._opts.debug) {
          console.groupCollapsed(`${Relax.displayName} will mount 🚀`)
          console.log('props=>', JSON.stringify(this.relaxProps, null, 2))
          console.groupEnd()
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
      //如果前后两次props的数量都不一致，直接刷新
      if (Object.keys(nextProps).length != Object.keys(this.props).length) {
        return true
      }

      const newRelaxProps = this.computeProps(nextProps)
      if (is(fromJS(this.relaxProps), fromJS(newRelaxProps))) {
        return false
      }

      this.relaxProps = newRelaxProps

      if (process.env.NODE_ENV != 'production') {
        if (this.context['_plume$Store']._opts.debug) {
          console.groupCollapsed(`${Relax.displayName} will update 🚀`)
          console.log('props=>', JSON.stringify(this.relaxProps, null, 2))
          console.groupEnd()
        }
      }

      return true
    }

    componentWillUnmount() {
      this.context.unsubscribe(this._handleStoreChange)
    }

    render() {
      return <Wrapper {...this.props} {...this.relaxProps} />
    }

    computeProps(props) {
      const dqlMap = {} as { [name: string]: DynamicQueryLang }
      const relaxProps = {}
      const store: Store = this.context['_plume$Store']

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
        const lang = dql.withContext(relaxProps).analyserLang(dql.lang())
        const ql = this._dql2QL[propName].setLang(lang)
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