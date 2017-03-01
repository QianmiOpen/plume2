# plume 🚀🚀
light weight framework for mobile web

# Getting Started

```sh
yarn add plume2 #npm install plume2
```

# quick demo
```js

class HelloActor extends Actor {
  defaultState() {
    return {text: 'hello world'}
  }

  @Action
  change(state, text) {
    return state.set('text', text)
  }
}

class AppStore extends Store {
  bindActor() {
    return [new HelloActor]
  }
}

@Relax
class Text extends React.Component {
  static relaxProps = {
    text: 'text'
  };

  render() {
    return <div>{this.props.relaxProps.text}</div>
  }
}


@StoreProvider(AppStore)
class HelloApp extends React.Component {
  render() {
    return <Text/>
  }
}

ReactDOM.render(<HelloApp/>, document.getElementById('app'))
```