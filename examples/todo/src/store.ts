import { Store, IOptions } from 'plume2';
import TextActor from './actor/text-actor';
import FilterActor from './actor/filter-actor';
import TodoActor from './actor/todo-actor';
import actionCreator from './action-creator';

export default class AppStore extends Store {
  bindActor() {
    return [new TextActor(), new FilterActor(), new TodoActor()];
  }

  bindActionCreator() {
    return actionCreator;
  }
}
