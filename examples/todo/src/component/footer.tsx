import * as React from 'react'
import { Relax, storePath, storeMethod } from 'plume2'
import { countQL } from '../ql'
const noop = () => { }

type Handler = () => void;

interface FooterProps {
  changeFilter?: (text: string) => void;
  clearCompleted?: Handler;
  filterStatus?: string;
  count?: number;
}

@Relax
export default class Footer extends React.Component<FooterProps, any> {
  static defaultProps = {
    changeFilter: storeMethod('changeFilter'),
    clearCompleted: storeMethod('clearCompleted'),

    count: countQL,
    filterStatus: storePath('filterStatus', ''),
  };


  render() {
    const {changeFilter, filterStatus, count, clearCompleted} = this.props
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
