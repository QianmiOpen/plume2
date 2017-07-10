import { QL } from 'plume2';
import { fromJS } from 'immutable';

window['QL'] = QL;

/**
 * 查询输入框的值
 */
export const valueQL = QL('valueQL', ['value', value => value]);

/**
 * 查询todo
 */
export const todoQL = QL('todoQL', [
  'todo',
  'filterStatus',
  (todo, filterStatus) => {
    if (filterStatus === '') {
      return todo;
    }
    const done = filterStatus === 'completed';
    const a = todo.filter(v => {
      return v.get('done') === done;
    });
    return a;
  }
]);

/**
 * 查询todo的数量
 */
export const countQL = QL('countQL', [todoQL, todoQL => todoQL.count()]);
