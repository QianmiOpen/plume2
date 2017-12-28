import { Store, IOptions } from 'plume2';
import CountActor from './actor/count-actor';
import LoadingActor from './actor/loading-actor';
import { fetchCount } from './webapi';
import actionCreator from './action-creator';

export default class AppStore extends Store {
  bindActor() {
    return [
      //count-actor
      new CountActor(),
      //loading-actor
      new LoadingActor()
    ];
  }

  bindActionCreator() {
    return actionCreator;
  }
}
