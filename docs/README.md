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

__什么是Store?__

Store, 我们的数据状态容器中心，管理着整个app的数据的生命周期。

我们坚守单根数据源的思想(single data source)，store中保持着完整的业务以及UI的状态

__Store的主要职责有哪些?__

1. 聚合actor
2. 分派actor(单分派、事务分派)
3. 通过bigQuery计算我们的查询语言(QL/DQL)
4. 响应页面的事件(ActionCreator)

__Show me code!__

```js
 import {Store} from 'plume2'
 import LoadingActor from 'loading-actor'
 import UserActor from 'user-actor'
 import TodoActor from 'todo-actor'

 class AppStore extends Store {
   /**
    * 聚合Actor
    * 通过reduce 各个actor的defaultState
    * 聚合出store的state作为source data.
    */
   bindActor() {
     return [
       new LoadingActor,
       new UserActor,
       new TodoActor
     ]
   }

   //;;;;;;;;;;;;;响应页面事件的逻辑处理;;;;;;;;;;;;;;
   update = () => {
     //将计算的任务分派的到actor
     //然后根据actor的返回值，重新聚合新的store的state
     //该为单分派，当dispatch结束，store的state发生改变的时候，
     //UI容器组件(StoreProvider, Relax)会收到通知重新re-render UI
     this.dispatch('update')
   };

   save = () => {
      //事务分派
      //很多场景下，计算应该是原子类型的,我们想一组dispatch结束才通知UI去re—render
      //这个时候我们就可以开启事务控制
      //transaction, 会返回值来判断在dispatch过程中有没有发生错误
      //如果发生错误，数据会自动回滚到上一次的状态，避免脏数据
      //我们也可以指定，自定义的回滚处理
      //this.transaction(()=> {/*正常逻辑*/}, () => {/*自定义的回滚函数*/})
      this.transaction(() => {
        this.dispatch('loading:end')
        
        //这个地方可以得到上一次的dispatch之后的结果
        //如：
        const loading = this.state().get('loading')

        this.dispatch('init:user', {id: 1, name: 'plume2'})
        this.dispatch('save')
      })
   };
 }
```

Store public-API

```text

/**
 * 绑定需要聚合的Actor
 */
bindActor(): Array<Actor>

/**
 * 事务控制dispatch
 * dispatch: 正常逻辑
 * rollBack： 自定义回滚逻辑，默认是自动回滚到上一次状态
 * 返回是否发生回滚
 */
transaction(dispatch: Dispatch, rollBack: RollBack): boolean;

/**
 *计算QL
 */
bigQuery(ql: QueryLang): any;


/*
 * 当前store聚合的状态
 */
state(): IMap;

/**
 * 定义store状态更新通知
 */
subscribe(cb: Handler): void;

/**
 * 取消订阅
 */
unsubscribe(cb: Handler): void;

```


## StoreProvider

StoreProvider容器组件衔接我们的React组件和AppStore。向React组件提供数据源。

在StoreProvider中的主要任务是:

1. 初始化我们的AppStore 
2. 将AppStore的对象绑定到React组件的上下文 
3. Relay就是通过上下文取的store对象
4. 监听Store的state变化

__友情提示:我们还提供了debug模式😁__

__开启debug模式__，我们就可以对数据进行全链路跟踪

跟踪store的dispatch，actor的处理，relax对QL的计算等

__code__

```js
 import React, {Component} from 'react';
 import {StoreProvider} from 'iflux2'
 import AppStore from './store'

 //enable debug
 @StoreProvider(AppStore, {debug: true})
 class ShoppingCart extends Component {
   render() {
     return (
       <Scene>
         <HeaderContainer/>
         <ShoppingListContainer/>
         <BottomToolBarContainer/>
       </Scene>
     )
   }
 }
```

## Relax

> 致敬Reley, 更希望我们小伙伴可以relax

Relax是plume2中非常重要的容器组件，类似Spring容器的依赖注入一样

核心功能会根据子组件的relaxProps中声明的数据，

通过智能计算属性的值，然后作为this.props.relaxProps透传给子组件

以此来解决React的props层层透传的verbose的问题。

__计算的规则:__
1. store的state的值，直接给出值得immutable的路径，
如： count: 'count', todoText: ['todo', 1, 'text']

2. store的method,直接和method同名的就ok
如： destroy: noop

```js
@Relax
export default class Footer extends React.Component{
  static relaxProps = {
    changeFilter: noop,
    clearCompleted: noop,
    count: countQL,
    filterStatus: 'filterStatus'
  };

  render() {
    const {
      changeFilter,
      clearCompleted,
      count,
      filterStatus
    } = this.props.relaxProps
    //...
  }
}
```

## QL/DQL

__为什么我们需要一个QL__

1. 我们把store state看成source data，因为UI展示的数据，可能需要根据我们的源数据进行组合

2. 我们需要UI的数据具有reactive的能力，当source data变化的时候，@Relax会去重新计算我们的QL

3. 命令式的编程手动的精确的处理数据之间的依赖和更新，Reactive会自动处理数据依赖，但是同一个QL可能会被执行多次，造成计算上的浪费，不过不需要担心，QL支持cache，确保path对应的数据没有变化的时候，QL不会重复计算

__QL = Query Lang__

自定义查询语法，数据的源头是store的state()返回的数据

__Syntax__
QL(displayName, [string|array|QL..., fn])

displayName，主要是帮助我们在debug状态更好地日志跟踪

string|array|QL: string|array都是immutable的get的path, QL其他的QL(支持无限嵌套)

fn: 可计算状态的回调函数，bigQuery会取得所有的所有的数组中的path对应的值，作为参数传递给fn

```js
/**
 * 返回：{
 * id: 1,
 * name: 'iflux2',
 * address: {
 *   city: '南京'
 * }
 *}
 */
 store.state()

// QL计算的结果值是 “iflux2南京"
const helloQL = QL('helloQL', [
  'name',
  ['address', 'city'],
  (name, city) => `${name}${city}`
])

store.bigQuery(helloQL)
```

__QL in QL__

```js
import {QL} from 'plume2'

const loadingQL = QL('loadingQL', [
  'loading',
  loading => loading
])

const userQL = QL('userQL', [
  //query lang 支持嵌套
  loadingQL,
  ['user', 'id'],
  (id, loading) => ({id, loading})
])
```

__DQL: Dynamic Query Lang__

某些复杂场景下，不确定ql的查询path, 我们可以使用动态的占位符

然后Relax会自动根据上下文参数替换，使DQL转换为QL

```js
const helloql = QL('helloDQL', [
  ['todo', '$index', 'text'],
  (text) => text
])
```

## Log

![log](https://raw.githubusercontent.com/hufeng/plume2/master/docs/screenshot/1.png)

![reat](https://raw.githubusercontent.com/hufeng/plume2/master/docs/screenshot/react.png)

## quickly debug

![store](https://raw.githubusercontent.com/hufeng/plume2/master/docs/screenshot/plume2.png)

## more examples

[counter](https://github.com/hufeng/plume2/tree/master/examples/counter)

[timer](https://github.com/hufeng/plume2/tree/master/examples/timer)

[todo](https://github.com/hufeng/plume2/tree/master/examples/todo)

[SmileApp-ReactNative](https://github.com/hufeng/plume2/tree/master/examples/SmileApp)
