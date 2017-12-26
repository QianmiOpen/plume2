/**
 * 判断当前的callexpress是不是QL
 * @param {*} path 
 */
export const isQLCallExpress = path => {
  const { node } = path;
  return node.callee.name === 'QL';
};

/**
 * 是不是可用的QL的语法
 * @param {*} path 
 */
export const isValidQLSyntax = path => {
  const { node } = path;
};
