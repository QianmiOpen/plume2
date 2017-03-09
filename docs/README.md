# Hello, plume2.
```javascript
import {Actor, Store, StoreProvider, Relax} from 'plume2'

//MapReduce
class HelloActor extends Actor {
  defaultState() {
    return {text: 'Hello, plume2'}
  }
}

//Single Data Source
class AppStore extends Store {
  bindActor() {
    return [
      new HelloActor
    ]
  }
}

//Auto compute relaxProps
@Relax
class Text extends React.Component {
  static relaxProps = {
    text: 'text'
  }

  render() {
    const {text} = this.props.relaxProps
    return <div>{text}</div>
  }
}

//App entry
@StoreProvider(AppStore)
class HelloApp extends React.Component {
  render() {
    return <Text/>
  }
}

//render dom
ReactDOM.render(<HelloApp/>, document.getElementById('app'))
```

# Getting started

```sh
yarn add plume2
```

完整的脚手架参考[plume2-starter](https://github.com/hufeng/plume2-starter)

# 1km俯瞰

```text
+------------------+
|     BFF-API      |       normalize或者JSON-Graph(Falcon)
+------------------+
        ||
        \/
+------------------+
|     WebApi       |       Fetch
+------------------+
        ||
        \/
+------------------+
|     Store        | ===> [Actor1, Actor2, Actor3](建议:领域驱动[DDD])
+------------------+
        ||
        \/
+------------------+
|  @StoreProvider  |   
+------------------+
        ||
        \/
+------------------+
|     @Relax       |
+------------------+
        ||
        \/
+------------------+
|     relaxProps   |
+------------------+
        ||
        \/
+------------------+
|  PureComponent   |
+------------------+
```

# API

## Actor

学习Erlang中的Actor的计算模型，一个独立的计算单元，主要作用就是转换我们的状态数据

我们取OO得形，得FP的意。以OO的方式封装我们代码的结构，以函数式的方式处理状态

感谢ImmutableJS.

怎么使用Actor，Talk is cheap, show me the code!!

```js
import {Actor, Action} from 'plume2'

/**
 * 是的，这就是一个Actor简单世界。
 */
class HelloActor extends Actor {
  /**
   * 领域的初始数据，该数据会被自动的转化为immutable
   */
  defaultState() {
    return {text: 'hello plume2'}
  }

  /**
   * 通过@Action来建立store的dispatch和actor的handler之间的关联
   *
   * API规范,
   *  @param state actor上一次的immutable状态
   *  @param text store dispatch的参数值，尽量保持单值设计
   */
  @Action('change:text')
  change(state, text) {
    //immutable api
    return state.set('text', text)
  }
}
```

## Store

bindActor
transaction
bigQuery
dispatch


## StoreProvider

## Relax


## QL/DQL
```js
const helloQL = QL('helloQL', [
  loading,
  text,
  (loading, text) => ({loading, text})
])
```

## Log

## quickly debug

## more examples

[counter](https://github.com/hufeng/plume2/tree/master/examples/counter)

[timer](https://github.com/hufeng/plume2/tree/master/examples/timer)

[todo](https://github.com/hufeng/plume2/tree/master/examples/todo)

[SmileApp-ReactNative](https://github.com/hufeng/plume2/tree/master/examples/SmileApp)
