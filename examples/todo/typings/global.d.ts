import { TViewAction } from 'plume2';
import * as viewAction from '../src/view-action';

declare global {
  declare const __DEV__: boolean;
  declare type TTodoViewAction = TViewAction<typeof viewAction>;
}
