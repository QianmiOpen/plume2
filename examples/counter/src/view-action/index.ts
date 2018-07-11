import { ViewAction } from 'plume2';
import { Command } from '../command';

export class CounterViewAction extends ViewAction {
  increment = () => {
    this.store.dispatch(Command.INCREMENT);
  };

  decrement = () => {
    this.store.dispatch(Command.DECREMENT);
  };
}
