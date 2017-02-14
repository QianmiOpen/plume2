import { Map, fromJS } from 'immutable'
import Actor from './actor'

type IMap = Map<string, any>;

type Handler = (state: IMap) => void;

export default class Store {
  _state: IMap;
  _callbacks: Array<Handler>;
  _actors: Array<Actor>;
  _actorsState: Array<IMap>;

  constructor(props) {
    this._state = fromJS({})
    this._actorsState = []
    this._callbacks = []
    this._actors = this.bindActor()
    this.reduceActor()
  }

  bindActor(): Array<Actor> {
    return []
  }

  reduceActor() {
    this._state = this._state.withMutations(state => {
      for (let actor of this._actors) {
        let initState = fromJS(actor.defaultState())
        this._actorsState.push(initState)
        state = state.merge(initState)
      }
      return state
    })
  }

  dispatch(msg: string, params?: any) {
    if (process.env.NODE_ENV != 'production') {
      console.log(`store dispatch msg => ${msg}, params => ${JSON.stringify(params)}`)
    }

    const newStoreState = this._state.withMutations(state => {
      for (let i = 0, len = this._actors.length; i < len; i++) {
        let actor = this._actors[i]

        const fn = actor.route(msg)

        //如果actor没有处理msg的方法，直接跳过
        if (!fn) {
          continue
        }

        //debug
        if (process.env.NODE_ENV != 'production') {
          const actorName = actor.constructor.name
          console.log(`${actorName} => @Action('${msg}'), params => ${JSON.stringify(params)}'`)
        }

        let preState = this._actorsState[i]
        const newState = actor.receive(msg, preState, params)
        if (preState != newState) {
          this._actorsState[i] = newState
          state = state.merge(newState)
        }
      }

      return state
    })

    if (newStoreState != this._state) {
      this._state = newStoreState
      //emit event
      this._callbacks.forEach(cb => cb(this._state))
    }
  }

  state() {
    return this._state
  }

  subscribe(cb: Handler) {
    if (typeof (cb) != 'function' || this._callbacks.indexOf(cb) != -1) {
      return
    }

    this._callbacks.push(cb)
  }

  unsubscribe(cb: Handler) {
    const index = this._callbacks.indexOf(cb)
    if (typeof (cb) != 'function' || index == -1) {
      return
    }

    this._callbacks.splice(index, 1)
  }


  pprint() {
    if (process.env.NODE_ENV != 'production') {
      console.log(JSON.stringify(this._state, null, 2))
    }
  }

  pprintActor() {
    if (process.env.NODE_ENV != 'production') {
      const stateObj = {}
      this._actors.forEach((actor, index) => {
        const name = actor.constructor.name
        stateObj[name] = this._actorsState[index].toJS()
      })
      console.log(JSON.stringify(stateObj, null, 2))
    }
  }
}