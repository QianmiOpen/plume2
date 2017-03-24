import { Store, IOptions } from 'plume2'
import HelloActor from './actor/hello-actor'

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      (window as any)._store = this
    }
  }

  bindActor() {
    return [
      new HelloActor
    ]
  }
}