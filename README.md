# plume 🚀🚀
light weight framework for mobile web

[![NPM](https://nodei.co/npm/plume2.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/plume2)


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
    const {text} = this.props.relaxProps
    return <div>{text}</div>
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
