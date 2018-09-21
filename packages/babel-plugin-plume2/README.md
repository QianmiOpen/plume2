# babel-plugin-plume2

通过这个 babel 插件可以做一些编译器的针对 AST 的特殊优化。

为了解决 React 父子组件之间的级联渲染问题，
我们需要 react—dom 的 unstable_batchedUpdates 方法。

而此方法在 reactnative 中是通过 react-native 模块暴露的，所以我们这个插件就可以在编译器做特殊处理

//TODO 后期会有更多的优化
