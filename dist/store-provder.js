"use strict";
function StoreProvider(AppStore, opts) {
    return function wrapper(Base) {
        return class WrapperComponent extends Base {
            constructor(props) {
                super(props);
                this._handleStoreChange = (state) => {
                    this.setState((preState) => state.toObject());
                };
                this._isMounted = false;
                this._store = new AppStore(opts);
                this.state = this._store.state().toObject();
                this._store.subscribe(this._handleStoreChange);
            }
            componentWillMount() {
                super.componentWillMount && super.componentWillMount();
                this._isMounted = false;
            }
            componentDidMount() {
                super.componentDidMount && super.componentDidMount();
                this._isMounted = true;
            }
            componentWillUpdate() {
                super.componentWillUpdate && super.componentWillUpdate();
                this._isMounted = false;
            }
            componentDidUpdate() {
                super.componentDidUpdate && super.componentDidUpdate();
                this._isMounted = true;
            }
            componentWillUnmount() {
                super.componentWillUnmount && super.componentWillUnmount();
                this._store.unsubscribe(this._handleStoreChange);
            }
            render() {
                return super.render();
            }
        };
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StoreProvider;
