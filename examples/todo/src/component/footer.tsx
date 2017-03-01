import * as React from 'react'
import { Relax } from 'plume2'
import { countQL } from '../ql'
const noop = () => { }

type Handler = () => void;

interface FooterProps {
  relaxProps?: {
    changeFilter: (text: string) => void;
    clearCompleted: Handler;
    filterStatus: string;
    count: number;
  }
}

@Relax
export default class Footer extends React.Component<FooterProps, any> {
  static relaxProps = {
    changeFilter: noop,
    clearCompleted: noop,
    count: countQL,
    filterStatus: 'filterStatus'
  };


  render() {
    const {
      changeFilter,
      filterStatus,
      count,
      clearCompleted
    } = this.props.relaxProps

    let countText = ''

    if (count > 1) {
      countText = `${count} items left`
    } else if (count === 1) {
      countText = '1 item left'
    }

    return (
      <footer className="footer" >
        <span className="todo-count" >{countText}</span>
        <ul className="filters" >
          <li>
            <a href="javascript:;"
              className={"" === filterStatus ? 'selected' : ''}
              onClick={() => changeFilter('')}>
              All
            </a>
          </li>
          < li >
            <a href="javascript:;"
              className={"active" === filterStatus ? 'selected' : ''}
              onClick={() => changeFilter('active')}>
              Active
            </a>
          </li>
          <li >
            <a href="javacript:;"
              className={'completed' === filterStatus ? 'selected' : ''}
              onClick={() => changeFilter('completed')}>
              Completed
            </a>
          </li>
        </ul>
        <button
          className="clear-completed"
          onClick={clearCompleted} >
          Clear completed
        </button>
      </footer>
    );
  }
}
