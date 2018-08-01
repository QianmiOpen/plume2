import Store from './store';
/**
 * ViewAction
 * UI = React(State, Action/Event)
 * State = Store(init, Action/Event)
 * UI的Action/Event是入口，出口就是Store的Action/Event
 */
export declare class ViewAction {
    protected store: Store;
    private _bindStore;
}
