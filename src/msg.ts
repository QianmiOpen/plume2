/**
 * 消息中心
 * usage
 *  import {msg} from 'plume2'
 *
 *  msg.on('hello', (param) => console.log(param))
 *  msg.emit('hello', 'hello')
 */
import * as mitt from 'mitt';

const msg: mitt.Emitter = new ((mitt as any).default || mitt)();

export default msg;
