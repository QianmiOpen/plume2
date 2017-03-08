"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCount = () => {
    return new Promise((resolve) => {
        //mock async
        setTimeout(() => {
            resolve({
                res: Math.floor((Math.random() * 100)),
                err: null
            });
        }, 200);
    });
};
