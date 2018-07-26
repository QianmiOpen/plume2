const transform = require('../index.js');
const babel = require('babel-core');

const example = `
import ReactDOM from 'react-dom';
var ReactDOM1 = require('react-dom');`;

describe('babel-plugin-plume2 test suite', () => {
  it('origin code', () => {
    const { code } = babel.transform(example, {
      plugins: [transform]
    });
    expect(code).toEqual(example);
  });

  it('match-snapshot', () => {
    const { code } = babel.transform(example, {
      plugins: [[transform, { reactnative: true }]]
    });
    expect(code).toMatchSnapshot();
  });
});
