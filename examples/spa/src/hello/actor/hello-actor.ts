import { Actor, Action, IMap } from 'plume2';

export default class HelloActor extends Actor {
  defaultState() {
    return { text: '你一抹😊如茉莉!' };
  }
}
