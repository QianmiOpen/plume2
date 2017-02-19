// Call a function asynchronously, as soon as possible.
// thanks Preact.
"use strict";
const resolved = typeof Promise !== 'undefined' && Promise.resolve();
const defer = resolved ? (f) => resolved.then(f) : setTimeout;
Object.defineProperty(exports, "__esModule", { value: true });
//expose
exports.default = defer;
