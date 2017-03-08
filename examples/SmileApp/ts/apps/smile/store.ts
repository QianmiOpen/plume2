import { Store, IOptions } from 'plume2'
import CountActor from './actor/count-actor'
import LoadingActor from './actor/loading-actor'
import { fetchCount } from './webapi'

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      window['_store'] = this
    }
  }

  bindActor() {
    return [
      new CountActor,
      new LoadingActor
    ]
  }

  init = async () => {
    const { res, err } = await fetchCount()
    const count = err ? 1 : res

    this.transaction(() => {
      this.dispatch('loading:end')
      this.dispatch('init', count)
    })
  };

  increment = () => {
    this.dispatch('increment')
  };
}