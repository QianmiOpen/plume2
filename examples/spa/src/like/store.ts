import { Store, IOptions, Action } from 'plume2';
import LikeActor from './actor/like-actor';
import actionType from './action-type';
import actionCreator from './action-creator';

export default class AppStore extends Store {
  bindActor() {
    return [new LikeActor()];
  }

  bindActionCreator() {
    return actionCreator;
  }

  @Action(actionType.INCREMENT)
  inc() {
    this.dispatch(actionType.INCREMENT);
  }
}
