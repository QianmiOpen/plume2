import React from 'react';
import { Relax } from 'plume2';
import { countQL } from '../ql';
import * as m from '../mutation';

@Relax
export default class Footer extends React.Component {
  props: {
    relaxProps?: {
      count: number;
      filterStatus: string;
    };
  };

  static relaxProps = {
    count: countQL,
    filterStatus: 'filterStatus'
  };

  render() {
    const { count, filterStatus } = this.props.relaxProps;
    const countText = this._getCountText(count);

    return (
      <footer className="footer">
        <span className="todo-count">{countText}</span>
        <ul className="filters">
          <li>
            <a
              href="javascript:;"
              className={'' === filterStatus ? 'selected' : ''}
              onClick={() => m.changeFilter('')}
            >
              All
            </a>
          </li>
          <li>
            <a
              href="javascript:;"
              className={'active' === filterStatus ? 'selected' : ''}
              onClick={() => m.changeFilter('active')}
            >
              Active
            </a>
          </li>
          <li>
            <a
              href="javacript:;"
              className={'completed' === filterStatus ? 'selected' : ''}
              onClick={() => m.changeFilter('completed')}
            >
              Completed
            </a>
          </li>
        </ul>
        <button className="clear-completed" onClick={m.clearCompleted}>
          Clear completed
        </button>
      </footer>
    );
  }

  _getCountText(count: number) {
    if (count > 1) {
      return `${count} items left`;
    } else if (count === 1) {
      return '1 item left';
    }
  }
}
