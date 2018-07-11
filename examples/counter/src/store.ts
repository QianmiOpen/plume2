import { Store } from 'plume2';
import CounterActor from './actor/counter-actor';
import * as ViewAction from './view-action';

export default class AppStore extends Store {
  bindActor() {
    return [new CounterActor()];
  }

  bindViewAction() {
    return ViewAction;
  }
}
