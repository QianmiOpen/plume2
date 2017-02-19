// Call a function asynchronously, as soon as possible.
// thanks Preact.

const resolved = typeof Promise !== 'undefined' && Promise.resolve()
const defer = resolved ? (f) => resolved.then(f) : setTimeout

//expose
export default defer