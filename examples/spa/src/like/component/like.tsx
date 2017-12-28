import * as React from 'react';
import { Relax } from 'plume2';
import { withRouter } from 'react-router-dom';
import actionType from '../action-type';
import actionCreator from '../action-creator';

@withRouter
@Relax
export default class Like extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      like: number;
    };
  };

  static relaxProps = {
    like: 'like'
  };

  render() {
    const { history } = this.props;
    const { like } = this.props.relaxProps;
    return (
      <div>
        <a
          href={'javascript:void(0);'}
          onClick={() => actionCreator.fire(actionType.INCREMENT)}
        >
          {`点赞🔥 ${like} `}
        </a>
        <div>
          <a href={'javascript:void(0);'} onClick={history.goBack}>
            返回hello
          </a>
        </div>
      </div>
    );
  }
}
