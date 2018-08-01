import { Store } from 'plume2';
import HelloActor from './actor/hello-actor';

export default class AppStore extends Store {
  bindActor() {
    return [HelloActor];
  }
}
