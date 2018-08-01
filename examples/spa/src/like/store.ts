import { Store } from 'plume2';
import LikeActor from './actor/like-actor';
import * as viewAction from './view-action';

export default class AppStore extends Store {
  bindActor() {
    return [LikeActor];
  }

  bindViewAction() {
    return viewAction;
  }
}
