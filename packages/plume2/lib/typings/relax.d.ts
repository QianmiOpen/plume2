import { IRelaxComponent } from './typing';
/**
 * 通过分析relaxProps构成，来判断@Relax需不需要订阅store的变化
 * @param relaxProps
 */
export declare const isRxRelaxProps: (relaxProps: Object) => boolean;
/**
 * Relax Container
 * 负责注入relaxProps属性对应的值
 * @param Wrapper
 */
export default function RelaxContainer(Wrapper: IRelaxComponent): any;
