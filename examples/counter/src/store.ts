import { Store } from 'plume2';
import actionCreator from './action-creator';
import CounterActor from './actor/counter-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new CounterActor()];
  }

  increment = () => {
    this.dispatch(actionCreator.INCREMENT);
  };

  decrement = () => {
    this.dispatch(actionCreator.DECREMENT);
  };
}
