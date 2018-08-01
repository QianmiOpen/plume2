import { ViewAction } from 'plume2';
import { Command } from './command';
import { fetchCount } from './webapi';

export class SmileAction extends ViewAction {
  init = async () => {
    const { res, err } = await fetchCount();
    const count = err ? 1 : res;

    this.store.transaction(() => {
      this.store.dispatch(Command.LOADING_END);
      this.store.dispatch(Command.INIT, count);
    });
  };

  increment = () => {
    this.store.dispatch(Command.INCREMENT);
  };
}
