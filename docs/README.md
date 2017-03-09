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

> 什么是Store?

Store, 我们的数据状态容器中心，管理着整个app的数据的生命周期。

我们坚守单根数据源的思想(single data source)，store中保持着完整的业务以及UI的状态

> Store的主要职责有哪些?

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
    * 通过reduce 各个actor的defaultState,聚合出store的state作为source data.
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

```js

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
