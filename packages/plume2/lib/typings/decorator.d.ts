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
export declare const Action: (msg: string) => (target: any, property: any, descriptor: TypedPropertyDescriptor<any>) => void;
