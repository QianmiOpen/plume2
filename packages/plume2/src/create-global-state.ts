import { fromJS, is } from 'immutable';
import { IMap } from './typing';

export type TSubscriber = (state: IMap) => void;
export type TSetter = (state: IMap) => void;
export type TRetVal = {
  state: IMap;
  getter: (callback: TSubscriber) => void;
  setter: (param: Object | TSetter) => void;
};

export function createGlobalState(data: Object): TRetVal {
  let state: IMap = fromJS(data);
  let subscribers = [];

  function getter(callback: TSubscriber) {
    subscribers.push(callback);
    callback(state);
  }

  function setter(param: Object | TSetter) {
    let newState = state;
    if (typeof param === 'object') {
      newState = state.merge(param);
    } else if (typeof param === 'function') {
      newState = state.withMutations(param);
    }

    if (!is(newState, state)) {
      state = newState;
      for (let subscribe of subscribers) {
        subscribe(state);
      }
    }
  }

  return {
    state,
    getter,
    setter
  };
}
