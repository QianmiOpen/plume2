/**
 * 全局的消息订阅分发中心
 */
import * as mitt from 'mitt'

type Handler = (event?: any) => void;

interface Emitter {
  on(type: string, handler: Handler): void;
  off(type: string, handler: Handler): void;
  emit(type: string, event?: any): void;
}

export default (new mitt() as Emitter)