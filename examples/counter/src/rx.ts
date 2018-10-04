import { RL } from 'plume2';

export const helloRL = RL('helloRL', [
  'count',
  count => {
    console.log('you can do side effect in here count=' + count);
  }
]);
