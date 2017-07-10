//@flow
import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import { todoQL } from '../ql';
import * as mutation from '../mutation';

interface IProps {
  relaxProps?: {
    index: number;
    todo: List<IMap>;
  };
}

@Relax
export default class MainSection extends React.Component<IProps, any> {
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
          onChange={e => mutation.toggleAll(e.target.checked)}
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
                  onChange={() => mutation.toggle(k)}
                />
                <label>
                  {v.get('text')}
                </label>
                <button
                  className="destroy"
                  onClick={() => mutation.destroy(k)}
                />
              </div>
            </li>
          )}
        </ul>
      </section>
    );
  }
}
