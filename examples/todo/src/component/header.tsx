import { Relax } from 'plume2';
import React from 'react';
import { valueQL } from '../ql';

@Relax
export default class Header extends React.Component {
  props: {
    relaxProps?: {
      value: string;
      viewAction: TTodoViewAction;
    };
  };

  static relaxProps = {
    value: valueQL,
    viewAction: 'viewAction'
  };

  render() {
    return (
      <header className="header">
        <h1>todos </h1>
        <input
          value={this.props.relaxProps.value}
          className="new-todo"
          onKeyDown={this._handleKeyDown}
          onChange={this._handleChange}
          placeholder="What needs to be done?"
          autoFocus
        />
      </header>
    );
  }

  _handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.relaxProps.viewAction.TodoAction.changeText(
      (e.target as any).value
    );
  };

  _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      this.props.relaxProps.viewAction.TodoAction.submitText(
        (e.target as any).value
      );
    }
  };
}
