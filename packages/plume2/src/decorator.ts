/**
 * 绑定Actor的Action
 * Usage:
 *  class HelloActor extends Actor {
 *     @Action('hello')
 *     hello(state) {
 *       return state;
 *     }
 *  }
 *
 * @param msg 事件名
 */

export const Action = (msg: string) => (
  target: any,
  //@ts-ignore
  property: any,
  descriptor: TypedPropertyDescriptor<any>
) => {
  target._route || (target._route = {});

  /**
   * 如果有actor的Action中有重名的事件名，warning
   */
  if (process.env.NODE_ENV != 'production') {
    if (target._route[msg]) {
      const actorName = target.constructor.name;
      console.warn(
        `😎${actorName} had @Action('${msg}'), Please review your code.`
      );
    }
  }

  target._route[msg] = descriptor.value;
};
