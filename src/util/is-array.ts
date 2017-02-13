const toString = Object.prototype.toString

export default function isArray(param: any)  {
  return toString.call(param) === '[object Array]'
}