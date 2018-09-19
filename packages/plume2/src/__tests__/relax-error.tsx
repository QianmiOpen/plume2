import React from 'react';
import renderer from 'react-test-renderer';
import { Relax } from '..';

@Relax
class ErrorComponent extends React.Component {
  render() {
    return <div>hello </div>;
  }
}

it('test throw error', () => {
  try {
    renderer.create(<ErrorComponent />);
  } catch (err) {
    expect(err.message).toBe(
      'Could not find any store in context, Please add @StoreProvder on top React Component'
    );
  }
});
