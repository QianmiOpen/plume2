### str-enum

在plume2或者iflux2的代码中，每当Store向Actor去dispatch事件的时候存在大量的字符串

```js
class AppStore extends Store {
  bindActor() {
    return [
      new LoadingActor
    ]
  }

  onInit = () => {
    this.store.dispatch('loading:end');
  }
}

class LoadingActor extends Actor {
  @Action('loading:end')
  end(state) {
    //
  }
}
```

一直在思考怎么去简化，

1. api比较简单

2. 最好能够代码自动提示

借助typescript的泛型支持，可以做到很好的类型提示

```ts
import StrEnum from 'str-enum'

const Action = StrEnum(
  'ADD_TODO',
  'DELETE_TODO'
)

const Action2 = StrEnum({
  PDF: 'application/pdf',
  Text: 'text/plain',
  JPEG: 'image/jpeg'
})
```