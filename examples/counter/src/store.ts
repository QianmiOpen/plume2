import { Store } from 'plume2';
import actionType from './action-type';
import CounterActor from './actor/counter-actor';
import actionCreator from './action-creator';

export default class AppStore extends Store {
  bindActor() {
    return [new CounterActor()];
  }

  bindActionCreator() {
    return actionCreator;
  }
}
