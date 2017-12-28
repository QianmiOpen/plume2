import { ActionCreator } from 'plume2';
import actionType from './action-type';
import { fetchCount } from './webapi';

const actionCreator = ActionCreator();
export default actionCreator;

actionCreator.create(actionType.INIT, async store => {
  const { res, err } = await fetchCount();
  const count = err ? 1 : res;

  store.transaction(() => {
    store.dispatch(actionType.LOADING_END);
    store.dispatch(actionType.INIT, count);
  });
});

actionCreator.create(actionType.INCREMENT, store => {
  store.dispatch(actionType.INCREMENT);
});
