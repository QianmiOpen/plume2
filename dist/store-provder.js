"use strict";
const React = require("react");
function StoreProvider(AppStore, opts) {
    return function wrapper(Base) {
        return _a = class WrapperComponent extends Base {
                constructor(props) {
                    super(props);
                    this.getChildContext = () => {
                        return {
                            _plume$Store: this.store
                        };
                    };
                    this._handleStoreChange = (state) => {
                        this.setState((preState) => state.toObject());
                    };
                    this._isMounted = false;
                    this.store = new AppStore(opts);
                    this.state = this.store.state().toObject();
                    this.store.subscribe(this._handleStoreChange);
                }
                componentWillMount() {
                    super.componentWillMount && super.componentWillMount();
                    this._isMounted = false;
                    //will drop on production env
                    if (process.env.NODE_ENV != 'production') {
                        if (this.store._opts.debug) {
                            console.log(`${WrapperComponent.displayName} will mount 🚀`);
                        }
                    }
                }
                componentDidMount() {
                    super.componentDidMount && super.componentDidMount();
                    this._isMounted = true;
                }
                componentWillUpdate() {
                    super.componentWillUpdate && super.componentWillUpdate();
                    this._isMounted = false;
                    //will drop on production env
                    if (process.env.NODE_ENV != 'production') {
                        if (this.store._opts.debug) {
                            console.log(`${WrapperComponent.displayName} will update 🚀`);
                        }
                    }
                }
                componentDidUpdate() {
                    super.componentDidUpdate && super.componentDidUpdate();
                    this._isMounted = true;
                }
                componentWillUnmount() {
                    super.componentWillUnmount && super.componentWillUnmount();
                    this.store.unsubscribe(this._handleStoreChange);
                }
                render() {
                    return super.render();
                }
            },
            _a.displayName = `StoreProvider(${getDisplayName(Base)})`,
            _a.childContextTypes = {
                _plume$Store: React.PropTypes.object
            },
            _a;
        var _a;
    };
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StoreProvider;
