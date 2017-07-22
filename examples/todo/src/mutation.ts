/**
 * Mutations
 */
import Store from './store';

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
  store.dispatch('change:text', text);

/**
 * 提交
 * @param text 
 */
export const submit = (text: string) =>
  //submit
  store.dispatch('submit', text);

/**
 * toggleAll
 * @param checked 
 */
export const toggleAll = (checked: boolean) =>
  store.dispatch('toggleAll', checked);

/**
 * toggle
 * @param index 
 */
export const toggle = (index: number) =>
  //dispatch
  store.dispatch('toggle', index);

/**
 * 改变过滤条件
 * @param filter 
 */
export const changeFilter = (filter: string) =>
  store.dispatch('change:filter', filter);

/**
 * 删除
 * @param index 
 */
export const destroy = (index: number) =>
  //delete
  this.dispatch('destroy', index);

/**
 * 清除所有的已经完成
 */
export const clearCompleted = () =>
  //clean
  this.dispatch('clearCompleted');
