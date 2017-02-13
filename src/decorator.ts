/**
 * @Action
 */
export function Action(msg: string): Function {
  return function(
    target: any,
    property: any, 
    descriptor: TypedPropertyDescriptor<any>) {
      target._route || (target._route = {})
      target._route[msg] = descriptor.value
  }
}