"use strict";
const React = require("react");
const ql_1 = require("./ql");
const dql_1 = require("./dql");
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
                //提前绑定事件，为了争取父子有序
                context._plume$Store.subscribe(this._handleStoreChange);
            }
            componentWillMount() {
                //先计算一次relaxProps
                this.computeProps();
                this._isMounted = false;
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
            componentWillUnmount() {
                this.context.unsubscribe(this._handleStoreChange);
            }
            render() {
                return React.createElement(Wrapper, Object.assign({}, this.props, this.relaxProps));
            }
            computeProps() {
                this.relaxProps = this.relaxProps || {};
                const store = this.context['_plume$Store'];
                const defaultProps = Relax.defaultProps;
                const dqlList = {};
                for (let propName in defaultProps) {
                    const propValue = defaultProps[propName];
                    //先取默认值
                    this.relaxProps[propName] = propValue;
                    //属性值如果是function，直接根据名称注入store中的方法
                    if (typeof (propValue) === 'function') {
                        this.relaxProps[propName] = store[propName];
                        continue;
                    }
                    //是不是源于store中的state
                    if (_isNotValidValue(store.state().get(propName))) {
                        this.relaxProps[propName] = store.state().get(propName);
                    }
                    //是不是ql
                    if (propValue instanceof ql_1.QueryLang) {
                        this.relaxProps[propName] = store.bigQuery(propValue);
                    }
                    //是不是dql
                    if (propValue instanceof dql_1.DynamicQueryLang) {
                        dqlList[propName] = propValue;
                    }
                }
                //计算dql
                for (let propName in dqlList) {
                    let ql = dqlList[propName].withContext(this.relaxProps).ql();
                    this.relaxProps[propName] = store.bigQuery(ql);
                }
            }
        },
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
    var _a;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RelaxContainer;
