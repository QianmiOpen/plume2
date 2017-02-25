"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StorePath {
    constructor(path, defaultValue) {
        this.path = path;
        this.defaultValue = defaultValue;
    }
}
exports.StorePath = StorePath;
function storePath(statePath, defaultValue) {
    return new StorePath(statePath, defaultValue);
}
exports.storePath = storePath;
class StoreMethod {
    constructor(methodName) {
        this.methodName = methodName;
    }
}
exports.StoreMethod = StoreMethod;
function storeMethod(methodName) {
    return new StoreMethod(methodName);
}
exports.storeMethod = storeMethod;
