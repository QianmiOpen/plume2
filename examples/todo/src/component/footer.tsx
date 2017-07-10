import * as React from 'react';
import { Relax } from 'plume2';
import { countQL } from '../ql';
import * as mutation from '../mutation';

interface IFootProps {
  relaxProps?: {
    count: number;
    filterStatus: string;
  };
}

@Relax
export default class Footer extends React.Component<IFootProps, any> {
  static relaxProps = {
    count: countQL,
    filterStatus: 'filterStatus'
  };

  render() {
    const { count, filterStatus } = this.props.relaxProps;
    let countText = this._getCountText(count);

    return (
      <footer className="footer">
        <span className="todo-count">
          {countText}
        </span>
        <ul className="filters">
          <li>
            <a
              href="javascript:;"
              className={'' === filterStatus ? 'selected' : ''}
              onClick={() => mutation.changeFilter('')}
            >
              All
            </a>
          </li>
          <li>
            <a
              href="javascript:;"
              className={'active' === filterStatus ? 'selected' : ''}
              onClick={() => mutation.changeFilter('active')}
            >
              Active
            </a>
          </li>
          <li>
            <a
              href="javacript:;"
              className={'completed' === filterStatus ? 'selected' : ''}
              onClick={() => mutation.changeFilter('completed')}
            >
              Completed
            </a>
          </li>
        </ul>
        <button className="clear-completed" onClick={mutation.clearCompleted}>
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
