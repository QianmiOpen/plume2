"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const immutable_1 = require("immutable");
const is_array_1 = require("./util/is-array");
const inject_1 = require("./inject");
const ql_1 = require("./ql");
function RelaxContainer(Wrapper) {
    return _a = class Relax extends React.Component {
            constructor(props, context) {
                super(props);
                this._handleStoreChange = (state) => {
                    if (this._isMounted) {
                        this.setState((preState) => state);
                    }
                };
                this._isMounted = false;
                this._dql2QL = {};
                //提前绑定事件，为了争取父子有序
                context._plume$Store.subscribe(this._handleStoreChange);
            }
            componentWillMount() {
                //先计算一次relaxProps
                this.relaxProps = this.computeProps();
                this._isMounted = false;
                if (process.env.NODE_ENV != 'production') {
                    if (this.context['_plume$Store']._opts.debug) {
                        console.groupCollapsed(`${Relax.displayName} will mount 🚀`);
                        console.log('props=>', JSON.stringify(this.relaxProps, null, 2));
                        console.groupEnd();
                    }
                }
            }
            componentDidMount() {
                this._isMounted = true;
            }
            componentWillUpdate() {
                this._isMounted = false;
            }
            componentDidUpdate() {
                this._isMounted = true;
            }
            shouldComponentUpdate(nextProps) {
                //如果前后两次props的数量都不一致，直接刷新
                if (Object.keys(nextProps).length != Object.keys(this.props).length) {
                    return true;
                }
                const newRelaxProps = this.computeProps();
                if (immutable_1.is(immutable_1.fromJS(this.relaxProps), immutable_1.fromJS(newRelaxProps))) {
                    return false;
                }
                this.relaxProps = newRelaxProps;
                if (process.env.NODE_ENV != 'production') {
                    if (this.context['_plume$Store']._opts.debug) {
                        console.groupCollapsed(`${Relax.displayName} will update 🚀`);
                        console.log('props=>', JSON.stringify(this.relaxProps, null, 2));
                        console.groupEnd();
                    }
                }
                return true;
            }
            componentWillUnmount() {
                this.context.unsubscribe(this._handleStoreChange);
            }
            render() {
                return React.createElement(Wrapper, Object.assign({}, this.props, this.relaxProps));
            }
            computeProps() {
                const relaxProps = {};
                const defaultProps = Relax.defaultProps;
                const dqlMap = {};
                const store = this.context['_plume$Store'];
                for (let propName in defaultProps) {
                    //props的属性值
                    const propValue = defaultProps[propName];
                    //如果值是StorePath
                    if (propValue instanceof inject_1.StorePath) {
                        const { defaultValue, path } = propValue;
                        const state = store._state;
                        relaxProps[propName] = (is_array_1.default(path)
                            ? state.getIn(path)
                            : state.get(path)) || defaultValue;
                    }
                    else if (propValue instanceof inject_1.StoreMethod) {
                        const { defaultValue, methodName } = propValue;
                        relaxProps[propName] = store[methodName] || defaultValue;
                        if (process.env.NODE_ENV != 'production') {
                            if (!store[methodName]) {
                                console.warn(`${Relax.displayName} can not find ${methodName} method in store`);
                            }
                        }
                    }
                    else if (propValue instanceof ql_1.QueryLang) {
                        relaxProps[propName] = store.bigQuery(propValue);
                    }
                    else if (propValue instanceof ql_1.DynamicQueryLang) {
                        if (!this._dql2QL[propName]) {
                            //根据DynamicQueryLang保存一份QL
                            //先用DQL的lang来填充QL
                            //后面会根据Dynamic的动态的计算lang
                            this._dql2QL[propName] = new ql_1.QueryLang(propValue.name(), propValue.lang());
                        }
                        dqlMap[propName] = propValue;
                    }
                }
                //计算dql
                for (let propName in dqlMap) {
                    const dql = dqlMap[propName];
                    const lang = dql.withContext(this.props).analyserLang(dql.lang());
                    const ql = this._dql2QL[propName].setLang(lang);
                    relaxProps[propName] = store.bigQuery(ql);
                }
                return relaxProps;
            }
        },
        //displayName
        _a.displayName = `Relax(${getDisplayName(Wrapper)})`,
        //拷贝WrapperComponent的defaultProps
        _a.defaultProps = Wrapper.defaultProps || {},
        //声明上下文依赖
        _a.contextTypes = {
            _plume$Store: React.PropTypes.object
        },
        _a;
    function _isNotValidValue(v) {
        return (typeof (v) != 'undefined' && v != null);
    }
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
    var _a;
}
exports.default = RelaxContainer;
