import React from 'react';
import { Relax } from 'plume2';
import { valueQL } from '../ql';
import * as m from '../mutation';

@Relax
export default class Header extends React.Component {
  props: {
    relaxProps?: {
      value: string;
    };
  };

  static relaxProps = {
    value: valueQL
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
    m.changeValue((e.target as any).value);
  };

  _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      m.submit((e.target as any).value);
    }
  };
}
