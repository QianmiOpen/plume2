"use strict";
const React = require("react");
const ql_1 = require("./ql");
const dql_1 = require("./dql");
const immutable_1 = require("immutable");
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
                this.relaxProps = this.computeProps(this.props);
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
                const newRelaxProps = this.computeProps(nextProps);
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
            computeProps(props) {
                const dqlMap = {};
                const relaxProps = {};
                const store = this.context['_plume$Store'];
                for (let propName in props) {
                    const propValue = props[propName];
                    //先取默认值
                    relaxProps[propName] = propValue;
                    //属性值如果是function，直接根据名称注入store中的方法
                    if (typeof (propValue) === 'function') {
                        relaxProps[propName] = store[propName];
                    }
                    else if (_isNotValidValue(store.state().get(propName))) {
                        relaxProps[propName] = store.state().get(propName);
                    }
                    else if (propValue instanceof ql_1.QueryLang) {
                        relaxProps[propName] = store.bigQuery(propValue);
                    }
                    else if (propValue instanceof dql_1.DynamicQueryLang) {
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
                    const lang = dql.withContext(relaxProps).analyserLang(dql.lang());
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RelaxContainer;
