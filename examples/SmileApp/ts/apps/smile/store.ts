import { Store } from 'plume2';
import CountActor from './actor/count-actor';
import LoadingActor from './actor/loading-actor';
import * as viewAction from './view-action';

export default class AppStore extends Store<typeof viewAction> {
  bindActor() {
    return [CountActor, LoadingActor];
  }

  bindViewAction() {
    return viewAction;
  }
}
