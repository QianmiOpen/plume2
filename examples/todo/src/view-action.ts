import { ViewAction } from 'plume2';
import { Command } from './command';

export class TodoAction extends ViewAction {
  changeText = (text: string) => {
    this.store.dispatch(Command.CHANGE_TEXT, text);
  };

  submitText = (text: string) => {
    this.store.dispatch(Command.SUMBIT_TEXT, text);
  };

  toggleAll = (checked: boolean) => {
    this.store.dispatch(Command.TOGGLE_ALL, checked);
  };

  toggle = (index: number) => {
    this.store.dispatch(Command.TOGGLE, index);
  };

  changeFilter = (filter: string) => {
    this.store.dispatch(Command.CHANGE_FILTER, filter);
  };

  destroy = (index: number) => {
    this.store.dispatch(Command.DESTROY, index);
  };

  cleanCompleted = () => {
    this.store.dispatch(Command.CLEAN_COMPLETED);
  };
}
