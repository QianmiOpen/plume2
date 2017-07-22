import React from 'react';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import { todoQL } from '../ql';
import * as m from '../mutation';

@Relax
export default class MainSection extends React.Component {
  props: {
    relaxProps?: {
      index: number;
      todo: List<IMap>;
    };
  };

  static relaxProps = {
    todo: todoQL
  };

  render() {
    const { todo } = this.props.relaxProps;

    return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          onChange={e => m.toggleAll(e.target.checked)}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todo.toArray().map((v, k) =>
            <li key={v.get('id')}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={v.get('done')}
                  onChange={() => m.toggle(k)}
                />
                <label>
                  {v.get('text')}
                </label>
                <button className="destroy" onClick={() => m.destroy(k)} />
              </div>
            </li>
          )}
        </ul>
      </section>
    );
  }
}
