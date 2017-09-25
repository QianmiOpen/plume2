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
      ImportDeclaration: function(path, state) {
        if (t.isStringLiteral(path.node.source, { value: 'react-dom' })) {
          path.node.source = t.StringLiteral('react-native');
        }
      },
      CallExpression(path) {
        if (isRequireReactDOM(t, path)) {
          path.node.arguments[0] = t.StringLiteral('react-native');
        }
      }
    }
  };
};
