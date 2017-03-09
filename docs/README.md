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

# 1km
从1km的高度俯瞰
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
|     Store        | ====> [Actor1, Actor2, Actor3] (领域驱动[DDD])
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

# Actor

defaultState
@Action

# Store

bindActor
transaction
bigQuery
dispatch


# StoreProvider

# Relax


# QL/DQL
```js
const helloQL = QL('helloQL', [
  loading,
  text,
  (loading, text) => ({loading, text})
])
```

# Log

# quickly debug

# more examples

[counter](https://github.com/hufeng/plume2/tree/master/examples/counter)

[timer](https://github.com/hufeng/plume2/tree/master/examples/timer)

[todo](https://github.com/hufeng/plume2/tree/master/examples/todo)

[SmileApp-ReactNative](https://github.com/hufeng/plume2/tree/master/examples/SmileApp)
