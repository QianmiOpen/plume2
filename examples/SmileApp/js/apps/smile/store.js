"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const plume2_1 = require("plume2");
const count_actor_1 = require("./actor/count-actor");
const loading_actor_1 = require("./actor/loading-actor");
const webapi_1 = require("./webapi");
class AppStore extends plume2_1.Store {
    constructor(props) {
        super(props);
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            const { res, err } = yield webapi_1.fetchCount();
            const count = err ? 1 : res;
            this.transaction(() => {
                this.dispatch('loading:end');
                this.dispatch('init', count);
            });
        });
        this.increment = () => {
            this.dispatch('increment');
        };
        if (__DEV__) {
            window['_store'] = this;
        }
    }
    bindActor() {
        return [
            new count_actor_1.default,
            new loading_actor_1.default
        ];
    }
}
exports.default = AppStore;
