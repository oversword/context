import log, { activeLog, inactiveLog } from ".";
import {expect, describe, test, jest} from '@jest/globals';

const fakeConsole = jest.fn()
console.log = fakeConsole
describe('debug log', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('logs to console when the active log is run', () => {
    activeLog('something', 'blah')
    expect(fakeConsole).toHaveBeenCalledTimes(1)
    expect(fakeConsole).toHaveBeenCalledWith('CTX DEBUG:', 'something', 'blah')
  })
  test('does nothing when the inactive log is run', () => {
    inactiveLog('something', 'blah')
    expect(fakeConsole).not.toHaveBeenCalled()
  })
  test('log should be inactive during production!', () => {
    expect(log).toBe(inactiveLog)
    expect(log).not.toBe(activeLog)
  })
})