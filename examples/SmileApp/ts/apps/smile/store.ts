import { Store, IOptions } from 'plume2';
import CountActor from './actor/count-actor';
import LoadingActor from './actor/loading-actor';
import { fetchCount } from './webapi';
import { context } from './mutation';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
    context(this);
  }

  bindActor() {
    return [
      //count-actor
      new CountActor(),
      //loading-actor
      new LoadingActor()
    ];
  }
}
