import { isArray } from 'util';
import { Store } from '..';

export interface IEvent {
  msg: string;
  params?: any;
  isInTransaction?: boolean;
}

/**
 * Time travalling
 */
export default class TimeTravel {
  constructor(store: Store) {
    this._cursor = 0;
    this._timeline = [];
    this._store = store;
    this._isInReplay = false;
  }

  private _timeline: Array<IEvent | Array<IEvent>>;
  private _isInReplay: boolean;
  private _cursor: number;
  private _store: Store;

  get timeline() {
    return this._timeline;
  }

  record({ msg, params, isInTransaction }: IEvent) {
    //如果当前是回放状态，不记录当前timeline
    if (this._isInReplay) {
      return;
    }

    if (!isInTransaction) {
      this._timeline.push({
        msg,
        params
      });
      return;
    }

    /**
     * 合并transaction状态到一个数组
     * [
     * {msg: 'hello', param: 'hello', isInTransaction: true},
     * {msg: 'world', param: 'world', isInTransaction: true},
     * {msg: 'foo', param: 'foo', isInTransaction: true}
     * ]
     *
     * ====>
     *
     * [[
     *  {msg: 'hello', params: 'hello'},
     *  {msg: 'world', params: "world"},
     *  {msg: 'foo', params: 'foo'}
     * ]]
     */

    const len = this._timeline.length;
    const last = len >= 1 ? len - 1 : 0;
    const lastElem = this._timeline[last];

    if (isArray(lastElem)) {
      lastElem.push({
        msg,
        params
      });
    } else {
      this._timeline.push([
        {
          msg,
          params
        }
      ]);
    }

    //同步游标位置
    this._cursor = this._timeline.length;
  }

  next() {
    ++this._cursor;
    //计算下一个游标位置
    const len = this._timeline.length;
    if (this._cursor > len) {
      this._cursor = len;
      if ((this._store as any)._opts.debug) {
        console.warn('next to end');
        return;
      }
    }

    if ((this._store as any)._opts.debug) {
      console.log('time-travel@next@cursor:#', this._cursor);
    }

    const timeline = this._timeline.slice(0, this._cursor);

    this._travel(timeline);
  }

  back() {
    //计算下一个游标位置
    --this._cursor;
    if (this._cursor <= 0) {
      this._cursor = 0;
      if ((this._store as any)._opts.debug) {
        console.warn('back to top');
        return;
      }
    }
    if ((this._store as any)._opts.debug) {
      console.log('time-travel@back@cursor:#', this._cursor);
    }

    const timeline = this._timeline.slice(0, this._cursor);
    this._travel(timeline);
  }

  commit() {}

  replay() {
    const len = this._timeline.length;

    if ((this._store as any)._opts.debug) {
      console.log('time-travel@replay@cursor[0-%d]', len);
    }
    this._travel(this._timeline);
    this._cursor = len;
  }

  _travel(timeline: Array<IEvent | Array<IEvent>>) {
    this._isInReplay = true;
    //reset init state
    (this._store as any)._reduceActorState();

    for (let event of timeline) {
      if (isArray(event)) {
        this._store.transaction(() => {
          for (let subEvent of event as Array<IEvent>) {
            let { msg, params } = subEvent as IEvent;
            this._store.dispatch(msg, params);
          }
        });
      } else {
        let { msg, params } = event as IEvent;
        this._store.dispatch(msg, params);
      }
    }
    this._isInReplay = false;
  }
}
