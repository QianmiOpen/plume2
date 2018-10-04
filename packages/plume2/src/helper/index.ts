import { QueryLang } from '../ql';
import { isArray, isString } from '../type';

/**
 * 获取组件的displayName便于react-devtools的调试
 * @param WrappedComponent
 */
export const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

/**
 * 判断Relax组件是不是需要订阅store的状态变化
 * 如果relaxprops注入的值全是事件或者viewAction就不去订阅
 */
export const isNeedRxStoreChange = (relaxProps: Object): boolean => {
  for (let prop in relaxProps) {
    const propValue = relaxProps[prop];
    if (
      //除viewAction外的字符串
      (isString(propValue) && prop !== 'viewAction') ||
      //数组
      isArray(propValue) ||
      //QL
      propValue instanceof QueryLang
    ) {
      return true;
    }
  }
  return false;
};
