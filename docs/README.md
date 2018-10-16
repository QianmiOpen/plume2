# Hello, plume2.

```javascript
import { Actor, Store, StoreProvider, Relax, ViewAction } from 'plume2';

//MapReduce
class HelloActor extends Actor {
  defaultState() {
    return { text: 'Hello, plume2' };
  }
}

//reactive ui event
class AppViewAction extends ViewAction {
  sayHello = text => {
    this.store.dispatch('say:hello', text);
  };
}

//Single Data Source
class AppStore extends Store {
  //bind data transform
  bindActor() {
    //after plume2@1.0.0, directly pass Actor class
    return [HelloActor];
  }

  //bind ui event
  bindViewAction() {
    return {
      AppViewAction
    };
  }
}

//Auto compute relaxProps
@Relax
class Text extends React.Component {
  static relaxProps = {
    //auto injected by store.state().get('text')
    text: 'text',
    //auto injected by store's bindViewAction
    viewAction: 'viewAction'
  };

  render() {
    const { text, viewAction } = this.props.relaxProps;
    return <div onClick={this._handleClick}>{text}</div>;
  }

  _handleClick = () => {
    const { text, viewAction } = this.props.relaxProps;
    viewAction.AppViewAction.sayHello(text);
  };
}

//App entry
@StoreProvider(AppStore)
class HelloApp extends React.Component {
  render() {
    return <Text />;
  }
}

//render dom
ReactDOM.render(<HelloApp />, document.getElementById('app'));
```

# Getting started

```sh
yarn add plume2
```

# 1km 俯瞰

```text
+------------------+
|     BFF-API      |       normalize或者JSON-Graph
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

学习 Erlang 中的 Actor 的计算模型，一个独立的计算单元，主要作用就是转换我们的状态数据

我们取 OO 得形，得 FP 的意。以 OO 的方式封装我们代码的结构，以函数式的方式处理状态

感谢 ImmutableJS.

怎么使用 Actor，Talk is cheap, show me the code!!

```js
import { Actor, Action } from 'plume2';

/**
 * 是的，这就是一个Actor简单世界。
 */
class HelloActor extends Actor {
  /**
   * 领域的初始数据，该数据会被自动的转化为immutable
   */
  defaultState() {
    //返回的对象会被自动的转化成immutable，
    //除非有特殊数据结构如(Set, OrderedMap之类)
    //不需要特殊指定immutable数据结构
    return { text: 'hello plume2' };
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
    return state.set('text', text);
  }
}
```

## Store

**什么是 Store?**

Store, 我们的数据状态容器中心，管理着整个 app 的数据的生命周期。

我们坚守单根数据源的思想(single data source)，store 中保持着完整的业务以及 UI 的状态

**Store 的主要职责有哪些?**

1.  聚合 actor
2.  分派 actor(单分派、事务分派)
3.  通过 bigQuery 计算我们的查询语言(QL/PQL)
4.  响应页面的事件(ViewAction)
5.  注册响应 RL

**Show me code!**

```js
import { Store, ViewAction } from 'plume2';
import LoadingActor from 'loading-actor';
import UserActor from 'user-actor';
import TodoActor from 'todo-actor';

/**
 *;;;;;;;;;;;;;响应页面事件的逻辑处理;;;;;;;;;;;;;;
 */
class AppViewAction extends ViewAction {
  //show simple dispatch
  //when dispatch finished, if status had changed,
  //each Relax component received message
  update = () => {
    //将计算的任务分派的到actor
    //然后根据actor的返回值，重新聚合新的store的state
    //该为单分派，当dispatch结束，store的state发生改变的时候，
    //UI容器组件(StoreProvider, Relax)会收到通知重新re-render UI
    this.store.dispatch('update');
  };

  //show multiple dispatch in a transaction
  save = () => {
    //事务分派
    //很多场景下，计算应该是原子类型的,我们想一组dispatch结束才通知UI去re—render
    //这个时候我们就可以开启事务控制
    //transaction, 会返回值来判断在dispatch过程中有没有发生错误
    //如果发生错误，数据会自动回滚到上一次的状态，避免脏数据
    //我们也可以指定，自定义的回滚处理
    //this.transaction(()=> {/*正常逻辑*/}, () => {/*自定义的回滚函数*/})
    this.store.transaction(() => {
      this.store.dispatch('loading:end');

      //这个地方可以得到上一次的dispatch之后的结果
      //如：
      const loading = this.state().get('loading');
      this.store.dispatch('init:user', { id: 1, name: 'plume2' });
      this.store.dispatch('save');
    });
  };
}

class AppStore extends Store {
  /**
   * 聚合Actor
   * 通过reduce 各个actor的defaultState
   * 聚合出store的state作为source data.
   */
  bindActor() {
    //plume2@1.0.0直接传递Actor的class
    return [LoadingActor, UserActor, TodoActor];
  }

  bindViewAction() {
    return {
      AppViewAction
    };
  }
}
```

Store public-API

```typescript
/**
 * 绑定需要聚合的Actor
 */
bindActor(): Array<Actor | typeof Actor>

bindViewAction(): IViewActionMapper

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

StoreProvider 容器组件衔接我们的 React 组件和 AppStore。向 React 组件提供数据源。

在 StoreProvider 中的主要任务是:

1.  初始化我们的 AppStore
2.  将 AppStore 的对象绑定到 React 组件的上下文
3.  Relay 就是通过上下文取的 store 对象
4.  监听 Store 的 state 变化

**友情提示:我们还提供了 debug 模式 😁**

**开启 debug 模式**，我们就可以对数据进行全链路跟踪

跟踪 store 的 dispatch，actor 的处理，relax 对 QL 的计算等

**code**

```js
import React, { Component } from 'react';
import { StoreProvider } from 'iflux2';
import AppStore from './store';

//enable debug
@StoreProvider(AppStore, { debug: true })
class ShoppingCart extends Component {
  render() {
    return (
      <Scene>
        <HeaderContainer />
        <ShoppingListContainer />
        <BottomToolBarContainer />
      </Scene>
    );
  }
}
```

## Relax

> 致敬 Reley, 更希望我们小伙伴可以 relax

Relax 是 plume2 中非常重要的容器组件，类似 Spring 容器的依赖注入一样

核心功能会根据子组件的 relaxProps 中声明的数据，

通过智能计算属性的值，然后作为 this.props.relaxProps 透传给子组件

以此来解决 React 的 props 层层透传的 verbose 的问题。

**计算的规则:**

1.  store 的 state 的值，直接给出值得 immutable 的路径，如： count: 'count', todoText: ['todo', 1, 'text']

2.  store 的 method,直接和 method 同名的就 ok
    如： destroy: noop, 我们更希望通过 ActionCreator 来单独处理 UI 的 side effect

3.  如果属性值是'viewAction'， 直接注入 store 中绑定的 ViewAction

4.  如果属性值是 QL，注入 QL 计算之后的结果， 如果 PQL 会自动绑定 store 的上下文

```js
@Relax
export default class Footer extends React.Component {
  static relaxProps = {
    changeFilter: noop,
    clearCompleted: noop,
    count: countQL,
    loadingPQL: loadingPQL,
    filterStatus: 'filterStatus',
    viewAction: 'viewAction'
  };

  render() {
    const {
      changeFilter,
      clearCompleted,
      count,
      filterStatus,
      viewAction
    } = this.props.relaxProps;
    //...
  }
}
```

## QL/PQL

**为什么我们需要一个 QL**

1.  我们把 store state 看成 source data，因为 UI 展示的数据，可能需要根据我们的源数据进行组合

2.  我们需要 UI 的数据具有 reactive 的能力，当 source data 变化的时候，@Relax 会去重新计算我们的 QL

3.  命令式的编程手动的精确的处理数据之间的依赖和更新，Reactive 会自动处理数据依赖，但是同一个 QL 可能会被执行多次，造成计算上的浪费，不过不需要担心，QL 支持 cache，确保 path 对应的数据没有变化的时候，QL 不会重复计算

**QL = Query Lang**

自定义查询语法，数据的源头是 store 的 state()返回的数据

**Syntax**
QL(displayName, [string|array|QL..., fn])

displayName，主要是帮助我们在 debug 状态更好地日志跟踪

string|array|QL: string|array 都是 immutable 的 get 的 path, QL 其他的 QL(支持无限嵌套)

fn: 可计算状态的回调函数，bigQuery 会取得所有的所有的数组中的 path 对应的值，作为参数传递给 fn

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
store.state();

// QL计算的结果值是 “iflux2南京"
const helloQL = QL('helloQL', [
  'name',
  ['address', 'city'],
  (name, city) => `${name}${city}`
]);

store.bigQuery(helloQL);
```

**QL in QL**

```js
import { QL } from 'plume2';

const loadingQL = QL('loadingQL', ['loading', loading => loading]);

const userQL = QL('userQL', [
  //query lang 支持嵌套
  loadingQL,
  ['user', 'id'],
  (loading, id) => ({ id, loading })
]);
```

**在 0.3.2 版本中我们做了些比较大的改变**

plume2 是我们的一个新的起点，是我们走向 typescript 的起点
plume2 完全站在 typescript 静态和编译角度去思考框架的特性和实现我们希望 plume2 足够轻量，简单，一致，同时给出优雅的代码检查错误提示，全链路的 log 跟踪，就想我们的开发能够轻松一点。

在我们实践过程中，也会一些不够细致地方，我们需要不断的去改进。在怎么去思考改进都不为过，划重点 <strong> 开发体验同用户体验一样重要 </strong>

## improvements

1.  干掉 DQL，DQL 有些鸡肋，这就是理想和现实的差别，DQL 实现过程中需要动态递归的替换模板变量也是比较受罪，更重要的事，DQL 的动态数据的来源只能是 React 的 Component 的 props，这就带来了一些不够灵活，比较受限。我们设计 DQL 或者 QL 本意是是什么，是获取数据声明式(Declarative)以及数据本身的反应式(reactive). 为了解决这个问题，我们设计了更简单的 PQL(partial Query Lang)

```js
  import {PQL, Relax} from 'plume2'

  const helloPQL = PQL(index => QL([
    ['users', index, 'name'],
    (name)=>name
  ]);

 @Relax
 class HelloContainer extends React.Component {
    static relaxProps = {
       hello: helloPQL
    }

   render() {
     const value = hello(1);
     return <div>{value}</div>
   }
 }
```

简单清晰实现，更灵活的参数入口。目前不支持 PQL 嵌套 PQL。

2.  更舒服的开发体验

有时候我们为了快速的在浏览器的控制台如(chrome console)去快速测试我们的一些 store 的方法，我们会写

```typescript
class AppStore extends Store {
  constructor(props: IOptions) {
    if (__DEV__) {
      window['_store'] = this;
    }
  }
}
```

这样可以在控制台直接调用\_store 去快速测试。 但是经常这样写，每个页面都这样写，就有点小烦躁，无缘无故去写个构造方法，也挺无趣。关键是如@angrycans 豹哥之前反馈,这样在一些 SPA 或者 react-native 的多页面中\_store 会被重复覆盖，也挺着急。那现在我们就从框架层面去解决这个问题。当开启应用的 debug 特性的时候，框架自动绑定。来简化这个流程。如：

```js
//开启debug-mode
@StoreProvder(AppStore, { debug: true })
class HelloApp extends React.Component {
  render() {
    return <div />;
  }
}
```

plume2 会自动在 window 上面绑定\_plume2App, 各个 key 就是 storeprovider 下的组件名称。

![image](https://user-images.githubusercontent.com/533008/34405262-565819e8-ebed-11e7-853c-03df9627f08a.png)
![image](https://user-images.githubusercontent.com/533008/34405280-6f4f199c-ebed-11e7-83f2-692d7461945a.png)

这样小伙伴尽情玩耍就可以了。

3.  更好的事件处理模块目前我们的 UI 交互的事件的 handler 都在 store 中，因为我们希望 UI 是 less-logic 这样才好通用我们业务层。之前都是通过 relax 和 relaxProps 去 injected 我们 store 的方法给 UI 的交互逻辑，如：

```typescript
const noop = () => {};
@Relax
class HelloApp extends React.Component {
  props: {
    relaxProps?: {
      OnInit: Function;
      onReady: Function;
      onShow: Function;
    };
  };

  static relaxProps = {
    onInit: noop,
    onReady: noop,
    onShow: noop
  };
}
```

这样的有点是简单，通过 relax 注入就完事了，就一个规则只要方法的名字和 store 的 method 名字相同就 ok。但是实践下来，同学们发现写一遍注入，再写一遍 typescript 类型定义，心里真是万马奔腾的感觉，太重太累。

更有甚者，我们可能某个很叶子节点的组件，仅仅是想回调一个事件，都要通过 relax 来注入，如果有列表数据的场景，设计的不当如果每个 item 都是 relax，页面 200 条数据，那就是 200relax 组件啊。relax 本质上是 subscribe container component, 它会实时监听 store 的变化，这 200 个。。哗啦啦的性能下降啊。
So 我们需要 rethink。在 react 里面，我们怎么定义 UI
UI = f(state) 其实这个并不完整，这个仅仅是定义了 UI 的展现部分，UI 还有交互，交互在函数式观点事件就是副作用。因此更完整的定义应该是 UI = f(state, action)，继续往下思考，什么是 state？站在 flux 的角度去看，
state = store(initState, action),😜，是不是很熟悉，都有 Action，这是不是有什么关联？其实就是一个是出口，一个是入口。

```text
UI(state, action)
state = store(init, action)

                     |---------|
                    \|/        |
UI = (store(init, action), action)
```

所以想到这里，我们就可以设计一个 ActionCreator 模块。

来来来，上代码。

```typescript
const actionCreator = ActionCreator();

actionCreator.create('INIT', (store, num: string) => {
  //biz logic
  store.dispatch('init', num);
});

class AppStore extends Store {
  //将store绑定到ActionCreator
  bindActionCreator() {
    return actionCreator;
  }

  //除了在用actionCreator.create创建
  //event handler,也可以直接在store中
  @Action('INIT')
  init(num: string) {
    this.dispatch('init', num);
  }
}

const HelloApp = () => (
  <div>
    <a onClick={actionCreator.fire('INIT', 1)}>爱我就赞我。</a>
  </div>
);
```

> Fixed

这种方式有个问题就是 ActionCreator 是个单例，这样会导致多次重复 render 一个页面的时候，
会有事件被 store 的上下文覆盖的问题。基于这样的考虑还是需要通过上下文注入绑定，所以
在 1.0.0 中我们设计了 ViewAction 来解决这个问题。

## ViewAction

```typescript
import { ViewAction, Store } from 'plume2';

class LoadingViewAction extends ViewAction {
  loading = () => {
    this.store.dispatch('loading:start');
  };
}

class FilterViewAction extends ViewAction {
  filter = (text: string) => {
    this.store.dispatch('fitler:text', text);
  };
}

//bind to store
class AppStore extends Store {
  bindViewAction() {
    return {
      LoadingViewAction,
      FilterViewAction
    };
  }
}

//how to injected to ui
class Filter extends React.Component {
  props: {
    relaxProps?: {
      //代码自动提示，参考example中的例子
      viewAction: TViewAction<typeof {LoadingViewAction, FilterViewAction}>
    }
  }
  static relaxProps = {
    viewAction: 'viewAction'
  };

  render() {
    const {viewAction} = this.props.relaxProps;
  }
}
```

## 都什么年代了 你还裸用字符串，你这是魔鬼字符串。。😓

4.  是的，我们加，我们加字符串的枚举类型，一次来解决 dispatch 到 actor 等各种常量字符串

```js
export default ActionType('INCREMENT', 'DECREMENT');
```

![image](https://user-images.githubusercontent.com/533008/34405949-2c8dfe62-ebf1-11e7-91b1-574b7a459b70.png)

更复杂的结构，

```js
const Actions = actionType({
  PDF: 'application/pdf',
  Text: 'text/plain',
  JPEG: 'image/jpeg'
});
```

> Fixed
> typescript 2.7 以后添加了字符串常量枚举

所以直接使用就好了，推荐使用常量字符串枚举，为什么？😆

```typescript
export const enum Command {
  LOADING = 'loading',
  FILTER_TEXT = 'filter:text'
}
```

### 金无足赤人无完人，在实践中积累，反思，成长。框架亦然。

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
