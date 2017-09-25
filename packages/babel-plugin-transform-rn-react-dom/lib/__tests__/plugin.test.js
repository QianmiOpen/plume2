const transform = require('../index.js');
const babel = require('babel-core');

const example = `
import ReactDOM from 'react-dom';
var ReactDOM1 = require('react-dom');
`;

it('origin code', () => {
  expect(example).toMatchSnapshot();
});

it('match-snapshot', () => {
  const { code } = babel.transform(example, {
    plugins: [transform]
  });

  expect(code).toMatchSnapshot();
});
