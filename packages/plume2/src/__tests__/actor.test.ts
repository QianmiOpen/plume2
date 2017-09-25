import { Map } from 'immutable';
import { Actor, Action, IMap } from '../index';

//////////////////init state/////////////////////////
class HelloActor extends Actor {
  defaultState() {
    return {
      name: 'plume2'
    };
  }

  @Action('change')
  change(state: IMap): IMap {
    return state.set('name', 'plume++');
  }
}

///////////////////////test suite/////////////////////
describe('actor test suite', () => {
  it('default state', () => {
    const helloActor = new HelloActor();

    expect(helloActor.defaultState()).toEqual({ name: 'plume2' });
  });

  it('_route', () => {
    const helloActor = new HelloActor();

    expect((helloActor as any)._route).toEqual({
      change: helloActor.change
    });
  });

  it('@Action method', () => {
    const helloActor = new HelloActor();
    const state = Map({ name: 'plume' });
    const newState = helloActor.receive('change', state);

    expect(newState.toJS()).toEqual({ name: 'plume++' });
  });
});
