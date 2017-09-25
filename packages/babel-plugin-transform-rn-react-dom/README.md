# babel-plugin-transform-rn-react-dom

在plume2或者iflux2默认对react-dom依赖unstable_batchedUpdates方法

该方法会解决react中父子组件级联渲染的问题

但是在react-native中并不需要依赖react-dom只需要依赖react-native本身就ok了

所有通过一个babel插件来自动转换


# Getting started

```sh
 yarn add babel-plugin-transform-rn-react-dom --dev
```

```javascript
  //.babelrc
  {
    "plugins": [
      "transform-rn-react-dom"
    ]
  }
```

