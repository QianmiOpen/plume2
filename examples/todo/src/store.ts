import { Store, IOptions } from 'plume2'
import TextActor from './actor/text-actor'
import FilterActor from './actor/filter-actor'
import TodoActor from './actor/todo-actor'

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props)
    if (__DEV__) {
      (window as any)._store = this
    }
  }

  bindActor() {
    return [
      new TextActor,
      new FilterActor,
      new TodoActor
    ]
  }

  changeValue = (text: string) => {
    this.dispatch('change:text', text)
  };

  submit = (text: string) => {
    this.dispatch('submit', text)
  };

  toggleAll = (checked: boolean) => {
    this.dispatch('toggleAll', checked)
  };

  changeFilter = (filter: string) => {
    this.dispatch('change:filter', filter)
  };
}