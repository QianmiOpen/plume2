//@flow
import * as React from 'react'
import { Relax, IMap, storeMethod } from 'plume2'
import { List } from 'immutable'
import { todoQL } from '../ql'
const noop = () => { }

interface IProps {
  index?: number;
  todo?: List<IMap>;
  toggle?: Function;
  destroy?: Function;
  toggleAll?: Function;
}

@Relax
export default class MainSection extends React.Component<IProps, any> {
  /**
   * All these props will be auto Dependency Inject by @Relax
   */
  static defaultProps = {
    index: 0,//假设是父组件传递的属性
    todo: todoQL,
    toggle: storeMethod('toggle'),
    destroy: storeMethod('destroy'),
    toggleAll: storeMethod('toggleAll')
  };

  render() {
    const {toggle, toggleAll, destroy, todo} = this.props

    return (
      <section className="main">
        <input className="toggle-all"
          type="checkbox"
          onChange={(e) => toggleAll(e.target.checked)} />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todo.toArray().map((v, k) =>
            <li key={v.get('id')}>
              <div className="view">
                <input className="toggle"
                  type="checkbox"
                  checked={v.get('done')}
                  onChange={() => toggle(k)} />
                <label>{v.get('text')}</label>
                <button className="destroy"
                  onClick={() => destroy(k)} />
              </div>
            </li>
          )}
        </ul>
      </section>
    );
  }
}
