import * as React from 'react'
import { Relax } from 'plume2'
import { withRouter } from 'react-router-dom'
const noop = () => { }

@withRouter
@Relax
export default class Like extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      like: number;
      inc: () => void;
    }
  };

  static relaxProps = {
    like: 'like',
    inc: noop
  };

  render() {
    const { history } = this.props
    const { like, inc } = this.props.relaxProps
    window['_history'] = history
    return (
      <div>
        <a href={'javascript:void(0);'}
          onClick={inc}>
          {`点赞🔥 ${like} `}
        </a>
        <div>
          <a
            href={'javascript:void(0);'}
            onClick={history.goBack}>
            返回hello
          </a>
        </div>
      </div>
    )
  }
}