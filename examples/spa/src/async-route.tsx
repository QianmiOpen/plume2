import React, { Component } from 'react'
import { Route } from 'react-router-dom'

type Loader = () => Promise<any>;

interface Props {
  exact?: boolean;
  strict?: boolean;
  path: string;
  load: Loader;
}

export default function AsyncRoute(props: Props) {
  const { load, ...rest } = props
  return (
    <Route
      {...rest}
      render={props => <AsyncLoader {...props} load={load} />}
    />
  )
}

class AsyncLoader extends Component<any, any> {
  props: {
    load: Loader;
  };

  constructor(props) {
    super(props)
    this.state = {
      Component: null
    }
  }

  componentDidMount() {
    this.props.load()
      .then(Cmp => this.setState({ Component: Cmp.default || Cmp }))
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { Component } = this.state

    return (
      Component
        ? <Component {...this.props} />
        : <div>Loading...</div>
    )
  }
}