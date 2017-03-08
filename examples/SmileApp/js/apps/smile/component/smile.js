"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const plume2_1 = require("plume2");
const uikit_1 = require("uikit");
let Smile = class Smile extends React.Component {
    render() {
        const { count, loading, increment } = this.props.relaxProps;
        //如果是loading，显示loading
        if (loading) {
            return <uikit_1.Loading />;
        }
        return (<react_native_1.View style={styles.container}>
        <react_native_1.Text style={styles.text} onPress={increment}>
          {`你一抹微笑如茉莉:) 😁${count}`}
        </react_native_1.Text>
      </react_native_1.View>);
    }
};
Smile.relaxProps = {
    count: 'count',
    loading: 'loading',
    increment: uikit_1.noop,
};
Smile = __decorate([
    plume2_1.Relax
], Smile);
exports.default = Smile;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});
