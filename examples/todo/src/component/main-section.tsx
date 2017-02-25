//@flow
import * as React from 'react'
import { Relax, IMap } from 'plume2'
import { List } from 'immutable'
import { todoQL } from '../ql'
const noop = () => { }

interface IProps {
  index?: number;
  todoQL?: List<IMap>;
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
    todoQL,
    toggle: noop,
    destroy: noop,
    toggleAll: noop
  };

  render() {
    const {toggle, toggleAll, destroy, todoQL} = this.props

    return (
      <section className="main">
        <input className="toggle-all"
          type="checkbox"
          onChange={(e) => toggleAll(e.target.checked)} />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todoQL.toArray().map((v, k) =>
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
