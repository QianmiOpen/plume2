import { ActionCreator } from 'plume2';
import actionType from './action-type';

const actionCreator = ActionCreator();
export default actionCreator;

actionCreator.create(actionType.INCREMENT, store =>
  store.dispatch(actionType.INCREMENT)
);

actionCreator.create(actionType.DECREMENT, store =>
  store.dispatch(actionType.DECREMENT)
);
