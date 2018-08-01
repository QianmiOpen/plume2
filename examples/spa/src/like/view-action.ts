import { ViewAction } from 'plume2';
import { Command } from './command';

export class LikeAction extends ViewAction {
  like = () => {
    this.store.dispatch(Command.INCREMENT);
  };

  dislike = () => {
    this.store.dispatch(Command.DECREMENT);
  };
}
