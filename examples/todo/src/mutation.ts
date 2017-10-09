/**
 * Mutations
 */
import Store from './store';
import actionCreator from './action-creator';

let store: Store;

/**
 * 绑定Store
 * @param appStore 
 */
export const bindStore = (appStore: Store) => {
  store = appStore;
};

/**
 * 改变文本值
 * @param text 
 */
export const changeValue = (text: string) =>
  store.dispatch(actionCreator.CHANGE_TEXT, text);

/**
 * 提交
 * @param text 
 */
export const submit = (text: string) =>
  //submit
  store.dispatch(actionCreator.SUMBIT_TEXT, text);

/**
 * toggleAll
 * @param checked 
 */
export const toggleAll = (checked: boolean) =>
  store.dispatch(actionCreator.TOGGLE_ALL, checked);

/**
 * toggle
 * @param index 
 */
export const toggle = (index: number) =>
  //dispatch
  store.dispatch(actionCreator.TOGGLE, index);

/**
 * 改变过滤条件
 * @param filter 
 */
export const changeFilter = (filter: string) =>
  store.dispatch(actionCreator.CHANGE_FILTER, filter);

/**
 * 删除
 * @param index 
 */
export const destroy = (index: number) =>
  //delete
  store.dispatch(actionCreator.DESTROY, index);

/**
 * 清除所有的已经完成
 */
export const clearCompleted = () =>
  //clean
  store.dispatch(actionCreator.CLEAN_COMPLETED);
