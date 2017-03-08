# Hello, plume2.
```typescript
import {
  Actor, 
  Action, 
  IMap, 
  IOptions,
  Store, 
  StoreProvider, 
  Relax
} from 'plume2'

class HelloActor extends Actor {
  defaultState() {
    return {text: 'Hello, plume2'}
  }

  @Action('change')
  change(state: IMap, text: string) {
    return state.set('text', text)
  }
}

class AppStore extends Store {
  bindActor() {
    return [
      new HelloActor
    ]
  }

  change = () => {
    this.dispatch('change', 'hello world')
  };
}

@StoreProvider(AppStore)
class HelloApp extends React.Component<any, any> {
  render() {
    return <Text/>
  }
}

class Text extends React.Component<any, any> {
  props: {
    relaxProps?: {
      text: string;
    }
  };

  static relaxProps = {
    text: 'text'
  }

  render() {
    const {text} = this.props.relaxProps
    return <div>{text}</div>
  }
}


```

# Getting started

# 1km

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
const helloQL = QL('helloQL', [
  loading,
  text,
  (loading, text) => ({loading, text})
])

# Log

# quickly debug

# more examples

[counter](https://github.com/hufeng/plume2/tree/master/examples/counter)

[timer](https://github.com/hufeng/plume2/tree/master/examples/timer)

[todo](https://github.com/hufeng/plume2/tree/master/examples/todo)

[SmileApp-ReactNative](https://github.com/hufeng/plume2/tree/master/examples/SmileApp)
