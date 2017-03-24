import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Relax } from 'plume2'


@Relax
export default class Hello extends React.Component<any, any> {
  props: {
    relaxProps?: {
      text: string;
    }
  };

  static relaxProps = {
    text: 'text'
  };

  render() {
    const { text } = this.props.relaxProps

    return (
      <div>
        {text}
        <Link to='/like'>Like</Link>
      </div>
    )
  }
}