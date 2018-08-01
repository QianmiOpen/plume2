import { QL } from 'plume2';

/**
 * 查询输入框的值
 */
export const valueQL = QL('valueQL', [
  'value',
  /**
   * 转换UI需要的值
   */
  value => value
]);

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
    //是否是完成状态
    const done = filterStatus === 'completed';
    return todo.filter(v => {
      return v.get('done') === done;
    });
  }
]);

/**
 * 查询todo的数量
 */
export const countQL = QL('countQL', [
  todoQL,
  /**
   * QL支持嵌套
   */
  todoQL => todoQL.count()
]);
