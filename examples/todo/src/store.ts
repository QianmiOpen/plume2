import { Store, IOptions } from 'plume2';
import TextActor from './actor/text-actor';
import FilterActor from './actor/filter-actor';
import TodoActor from './actor/todo-actor';
import * as mutation from './mutation';

export default class AppStore extends Store {
  mutation: typeof mutation;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
    mutation.bindStore(this);
    this.mutation = mutation;
  }

  bindActor() {
    return [new TextActor(), new FilterActor(), new TodoActor()];
  }
}
