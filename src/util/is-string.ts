const toString = Object.prototype.toString

export default function isString(param: any)  {
  return toString.call(param) === '[object String]'
}