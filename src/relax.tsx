import * as React from 'react'
import Store from './store'
import { Map } from 'immutable'

type IMap = Map<string, any>;

interface RelaxContext {
  _plume$Store: Store
}

export default function RelaxContainer(Wrapper: React.Component): React.Component {
  return class Relax extends React.Component {
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
      this.computeProps()
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

    componentWillUnmount() {
      this.context.unsubscribe(this._handleStoreChange)
    }

    render() {
      return <Wrapper {...this.props} {...this.relaxProps}/>
    }

    computeProps() {
      this.relaxProps = this.relaxProps || {}
      const store = this.context['_plume$Store']
      const defaultProps = Relax.defaultProps

      for (let propName in defaultProps) {
        const propValue = defaultProps[propName]
        //先取默认值
        this.relaxProps[propName] = propValue

        //属性值如果是function，直接根据名称注入store中的方法
        if (typeof(propValue) === 'function') {
          this.relaxProps[propName] = store[propName]
          continue
        }

        //是不是源于store中的state
       if (_isNotValidValue(store.state().get(propName))) {
          this.relaxProps[propName] = store.state().get(propName)
        }
      }
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
}