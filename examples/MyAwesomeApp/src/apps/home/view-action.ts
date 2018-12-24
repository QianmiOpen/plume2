import { go, ViewAction } from 'plume2';
import { Command } from './command';
import * as webapi from './webapi';

export class HomeViewAction extends ViewAction {
  onInit = async () => {
    const { res, err } = await go(webapi.fetchCount());
    if (err) {
      //获取数据错误
      return;
    }

    this.store.transaction(() => {
      this.store.dispatch(Command.LOADING_END);
      this.store.dispatch(Command.INIT_COUNT, res);
    });
  };

  onIncCount = () => {
    this.store.dispatch(Command.INCR_COUNT);
  };
}
