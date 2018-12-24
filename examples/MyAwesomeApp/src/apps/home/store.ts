import { Store } from 'plume2';
import actors from './actor';
import * as viewAction from './view-action';

export default class AppStore extends Store<typeof viewAction> {
  bindActor() {
    return [...actors];
  }

  bindViewAction() {
    return viewAction;
  }
}
