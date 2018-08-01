import { Relax } from 'plume2';
import React from 'react';
import { countQL } from '../ql';

@Relax
export default class Footer extends React.Component {
  props: {
    relaxProps?: {
      count: number;
      filterStatus: string;
      viewAction: TTodoViewAction;
    };
  };

  static relaxProps = {
    count: countQL,
    filterStatus: 'filterStatus',
    viewAction: 'viewAction'
  };

  render() {
    const { count, filterStatus, viewAction } = this.props.relaxProps;
    const countText = this._getCountText(count);

    return (
      <footer className="footer">
        <span className="todo-count">{countText}</span>
        <ul className="filters">
          <li>
            <a
              href="javascript:;"
              className={'' === filterStatus ? 'selected' : ''}
              onClick={() => viewAction.TodoAction.changeFilter('')}
            >
              All
            </a>
          </li>
          <li>
            <a
              href="javascript:;"
              className={'active' === filterStatus ? 'selected' : ''}
              onClick={() => viewAction.TodoAction.changeFilter('active')}
            >
              Active
            </a>
          </li>
          <li>
            <a
              href="javacript:;"
              className={'completed' === filterStatus ? 'selected' : ''}
              onClick={() => viewAction.TodoAction.changeFilter('completed')}
            >
              Completed
            </a>
          </li>
        </ul>
        <button
          className="clear-completed"
          onClick={() => viewAction.TodoAction.cleanCompleted()}
        >
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
