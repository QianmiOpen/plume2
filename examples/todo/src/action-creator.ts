import { ActionCreator } from 'plume2';
import actionType from './action-type';

const actionCreator = ActionCreator();
export default actionCreator;

actionCreator.create(actionType.CHANGE_TEXT, (store, text: string) => {
  store.dispatch(actionType.CHANGE_TEXT, text);
});

actionCreator.create(actionType.SUMBIT_TEXT, (store, text: string) => {
  store.dispatch(actionType.SUMBIT_TEXT, text);
});

actionCreator.create(actionType.TOGGLE_ALL, (store, checked: boolean) => {
  store.dispatch(actionType.TOGGLE_ALL, checked);
});

actionCreator.create(actionType.TOGGLE, (store, index: number) => {
  store.dispatch(actionType.TOGGLE, index);
});

actionCreator.create(actionType.CHANGE_FILTER, (store, filter: string) => {
  store.dispatch(actionType.CHANGE_FILTER, filter);
});

actionCreator.create(actionType.DESTROY, (store, index: number) => {
  store.dispatch(actionType.DESTROY, index);
});

actionCreator.create(actionType.CLEAN_COMPLETED, store => {
  store.dispatch(actionType.CLEAN_COMPLETED);
});
