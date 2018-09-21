import { go } from '../go';

const hello = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('hello');
    });
  });
};

const world = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('exception'));
    });
  });
};

it('test go success', async () => {
  const { res, err } = await go(hello());
  expect(res).toEqual('hello');
  expect(err).toEqual(null);
});

it('test go failed', async () => {
  let { res, err } = await go(world());
  expect(res).toEqual(null);
  expect(err).toEqual(new Error('exception'));
});

it('test multiple go', async () => {
  let { res, err } = await go(hello());
  expect(res).toEqual('hello');
  expect(err).toEqual(null);

  ({ res, err } = await go(world()));
  expect(res).toEqual(null);
  expect(err).toEqual(new Error('exception'));
});
