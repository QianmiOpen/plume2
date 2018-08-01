import { Relax, TViewAction } from 'plume2';
import React from 'react';
import { withRouter } from 'react-router-dom';
import * as viewAction from '../view-action';

@withRouter
@Relax
export default class Like extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      like: number;
      viewAction: TViewAction<typeof viewAction>;
    };
  };

  static relaxProps = {
    like: 'like',
    viewAction: 'viewAction'
  };

  render() {
    const { history } = this.props;
    const { like, viewAction } = this.props.relaxProps;

    return (
      <div>
        <a href={'javascript:void(0);'} onClick={viewAction.LikeAction.like}>
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
