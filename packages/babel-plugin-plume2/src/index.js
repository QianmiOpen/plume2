/**
 * 判断当前的call-expression是不是require('react-dom')
 * @param {*} t
 * @param {*} path
 */

function isRequireReactDOM(t, path) {
  return (
    t.isIdentifier(path.node.callee, { name: 'require' }) &&
    path.get('arguments.0').isStringLiteral({ value: 'react-dom' })
  );
}

module.exports = function(babel) {
  var t = babel.types;

  return {
    visitor: {
      /**
       * if current env is react-native
       * import ReactDOM from 'react-dom' => import ReactDOM from 'react-native'
       * @param {*} path
       * @param {*} param1
       */
      ImportDeclaration(path, { opts }) {
        if (
          opts.reactnative &&
          t.isStringLiteral(path.node.source, {
            value: 'react-dom'
          })
        ) {
          path.node.source = t.StringLiteral('react-native');
        }
      },

      /**
       * if current env is react-native
       * var ReactDOM = require('react-dom') => var ReactDOM = require('react-native');
       * @param {*} path
       * @param {*} param1
       */ CallExpression(path, { opts }) {
        if (opts.reactnative && isRequireReactDOM(t, path)) {
          path.node.arguments[0] = t.StringLiteral('react-native');
        }
      }
    }
  };
};
