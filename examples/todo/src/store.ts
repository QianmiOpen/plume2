import { Store } from 'plume2';
import FilterActor from './actor/filter-actor';
import TextActor from './actor/text-actor';
import TodoActor from './actor/todo-actor';
import * as viewAction from './view-action';

export default class AppStore extends Store {
  bindActor() {
    return [TextActor, FilterActor, TodoActor];
  }

  bindViewAction() {
    return viewAction;
  }
}
