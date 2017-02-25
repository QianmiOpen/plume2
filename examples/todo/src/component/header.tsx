import * as React from 'react'
import { Relax, storeMethod } from 'plume2'
import { valueQL } from '../ql'
const noop = () => { };

interface HeaderProps {
  value?: string;
  submit?: (text: string) => void;
  changeValue?: (text: string) => void;
}

@Relax
export default class Header extends React.Component<HeaderProps, any> {
  static defaultProps = {
    value: valueQL,
    submit: storeMethod('submit'),
    changeValue: storeMethod('changeValue')
  };

  render() {
    return (
      <header className="header" >
        <h1>todos </h1>
        <input value={this.props.value}
          className="new-todo"
          onKeyDown={this._handleKeyDown}
          onChange={this._handleChange}
          placeholder="What needs to be done?"
          autoFocus />
      </header>
    );
  }

  _handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.changeValue((e.target as any).value);
  };


  _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      this.props.submit((e.target as any).value);
    }
  };
}
