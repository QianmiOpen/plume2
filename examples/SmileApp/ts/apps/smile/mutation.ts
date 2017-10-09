import Store from './store';
import { fetchCount } from './webapi';
import actionCreator from './action-creator';

//bind store context
let store: Store;
export const context = (s: Store) => (store = s);

//init
export const onInit = async () => {
  const { res, err } = await fetchCount();
  const count = err ? 1 : res;

  store.transaction(() => {
    store.dispatch(actionCreator.LOADING_END);
    store.dispatch(actionCreator.INIT, count);
  });
};

export const onIncrement = () => store.dispatch(actionCreator.INCREMENT);
