import React from 'react';
import renderer from 'react-test-renderer';
import { Actor, Relax, Store, StoreProvider } from '..';

class HelloActor extends Actor {
  defaultState() {
    return { id: 1 };
  }
}

class AppStore extends Store {
  bindActor() {
    return [HelloActor];
  }
}

@StoreProvider(AppStore, { debug: true })
class Home extends React.Component {
  render() {
    let List = [];
    for (let i = 0; i < 20; i++) {
      List.push(<Test key={i} />);
    }
    return <div>{List}</div>;
  }
}

@Relax
class Test extends React.Component {
  render() {
    return <div>hello</div>;
  }
}

it('test output include warning', () => {
  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});
