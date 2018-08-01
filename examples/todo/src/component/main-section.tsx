import { List } from 'immutable';
import { IMap, Relax } from 'plume2';
import React from 'react';
import { todoQL } from '../ql';

@Relax
export default class MainSection extends React.Component {
  props: {
    relaxProps?: {
      index: number;
      todo: List<IMap>;
      viewAction: TTodoViewAction;
    };
  };

  static relaxProps = {
    todo: todoQL,
    viewAction: 'viewAction'
  };

  render() {
    const { todo, viewAction } = this.props.relaxProps;

    return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          onChange={e => viewAction.TodoAction.toggleAll(e.target.checked)}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todo.toArray().map((v, k) => (
            <li key={v.get('id')}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={v.get('done')}
                  onChange={() => viewAction.TodoAction.toggle(k)}
                />
                <label>{v.get('text')}</label>
                <button
                  className="destroy"
                  onClick={() => viewAction.TodoAction.destroy(k)}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
