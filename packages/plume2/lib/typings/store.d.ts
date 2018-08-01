import Actor from './actor';
import { QueryLang } from './ql';
import { IMap, IOptions, IViewActionMapper, TViewAction } from './typing';
export declare type TDispatch = () => void;
export declare type TRollback = () => void;
export declare type TSubscribeHandler = (state: IMap) => void;
/**
 * Store状态容器
 * 整个应用中心的状态管理 控制整个应用的状态控制
 * Store = f(Actor, ViewAction)
 */
export default class Store<T = {}> {
    constructor(props?: IOptions);
    readonly viewAction: TViewAction<T>;
    private _opts;
    private _state;
    private _callbacks;
    private _actors;
    private _actorsState;
    private _cacheQL;
    private _isInTranstion;
    /**
     * 绑定Actor
     */
    bindActor(): Array<Actor | typeof Actor>;
    /**
     * 绑定ViewAction
     */
    bindViewAction(): IViewActionMapper;
    /**
     * store分发事件协同actor
     *
     * @param msg 事件名称
     * @param params  参数
     */
    dispatch(msg: string, params?: any): void;
    /**
     * 事务控制dispatch
     *
     * @param dispatch 要执行的dispatch的正常逻辑
     * @param rollBack 发生rollback之后的自定义逻辑
     * @return 是不是发生了错误，数据回滚
     */
    transaction(dispatch: TDispatch, rollBack?: TRollback): boolean;
    /**
     * 计算querylang
     * @param ql querylang
     */
    bigQuery: (ql: string | QueryLang | (string | number)[]) => any;
    /**
     * 获取store容器的数据状态
     */
    state(): IMap;
    /**
     *获取数据的快捷方式
     */
    get(path: string | Array<string | number>): any;
    /**
     * 设置store数据容器的状态，一般用于rollback之后的状态恢复
     * @param state 设置store的状态
     */
    setState(state: any): void;
    /**
     * 定义store发生的数据变化
     * @param cb 回调函数
     */
    subscribe(cb: TSubscribeHandler): void;
    /**
     * 取消store发生数据变化的订阅
     * @param cb 回调函数
     */
    unsubscribe(cb: TSubscribeHandler): void;
    private _initViewAction;
    private _reduceActorState;
    private _notifier;
    private _dispatchActor;
    /**
     * 打印store中的数据状态
     */
    pprint(): void;
    /**
     * 打印store中的数据状态是从哪些Actor中聚合
     */
    pprintActor(): void;
}
