/**
 * 消息中心
 * usage
 *  import {msg} from 'plume2'
 *
 *  //绑定
 *  msg.on('hello', (param) => console.log(param))
 *  //触发
 *  msg.emit('hello', 'hello')
 *  //解绑
 *  msg.off('hello')
 */
import mitt from 'mitt';

const msg: mitt.Emitter = new mitt();

export default msg;
