"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
class Loading extends React.Component {
    render() {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.ActivityIndicator animating={true} size={'large'}/>
      </react_native_1.View>);
    }
}
exports.default = Loading;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
