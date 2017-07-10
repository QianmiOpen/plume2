import * as React from 'react';
import { Relax } from 'plume2';
import { valueQL } from '../ql';
import * as mutation from '../mutation';

interface IHeaderProps {
  relaxProps?: {
    value: string;
  };
}

@Relax
export default class Header extends React.Component<IHeaderProps, any> {
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
    mutation.changeValue((e.target as any).value);
  };

  _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      mutation.submit((e.target as any).value);
    }
  };
}
