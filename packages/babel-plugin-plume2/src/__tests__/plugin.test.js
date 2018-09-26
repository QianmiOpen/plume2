const plume2 = require('../index.js');
const babel = require('babel-core');

const example = `
import ReactDOM from 'react-dom';
var ReactDOM1 = require('react-dom');`;

describe('babel-plugin-plume2 test suite', () => {
  it('no react-native code', () => {
    const { code } = babel.transform(example, {
      plugins: [plume2]
    });
    expect(code).toEqual(example);
  });

  it('react-native match-snapshot', () => {
    const { code } = babel.transform(example, {
      plugins: [[plume2, { reactnative: true }]]
    });
    expect(code).toMatchSnapshot();
  });

  it('optimize QL name', () => {
    const example = `
    const helloQL = QL('helloQL', [/*...*/]);
    const worldQL = QL('worldQL', [/*...*/]);
    `;
    const { code } = babel.transform(example, {
      env: {
        production: {
          plugins: ['plume2']
        }
      }
    });

    expect(code).toMatchSnapshot();
  });

  it('optimize StoreProvider opts', () => {
    const example = `
    StoreProvider(AppStore, {debug: true})
    `;
    const { code } = babel.transform(example, {
      env: {
        production: {
          plugins: ['plume2']
        }
      }
    });
    expect(code).toMatchSnapshot();
  });
});
