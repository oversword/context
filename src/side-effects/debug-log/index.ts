const debug = false

export const activeLog = (...a: Array<unknown>): void => console.log('CTX DEBUG:', ...a)
export const inactiveLog = (..._a: Array<unknown>): void => {}
const log = debug ? activeLog : inactiveLog
export default log
