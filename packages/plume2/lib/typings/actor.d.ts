import { IMap, IReceiveMsg } from './typing';
/**
 * actor
 *
 * 借鉴MapReduce的理念，store负责分派，actor负责处理
 */
export default class Actor {
    constructor();
    private _route;
    defaultState(): Object;
    /**
     * 接收store分派的任务
     * @param msg
     * @param state
     * @param params
     */
    receive({ msg, state, params }: IReceiveMsg): IMap;
}
