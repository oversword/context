import evaluateDisabled from ".";
import {expect, describe, test, jest} from '@jest/globals';

describe('evaluateDisabled', () => {
  test('returns false if the conditional is false', () => {
    const result = evaluateDisabled(false, {})
    expect(result).toBe(false)
  })
  test('returns false if the conditional is null', () => {
    const result = evaluateDisabled(null, {})
    expect(result).toBe(false)
  })
  test('returns false if the conditional is undefined', () => {
    const result = evaluateDisabled(undefined, {})
    expect(result).toBe(false)
  })
  test('returns false if the conditional has no "disabled" property', () => {
    const result = evaluateDisabled({}, {})
    expect(result).toBe(false)
  })
  test('returns false if the "disabled" property is false', () => {
    const result = evaluateDisabled({ disabled: false }, {})
    expect(result).toBe(false)
  })
  test('returns true if the "disabled" property is true', () => {
    const result = evaluateDisabled({ disabled: true }, {})
    expect(result).toBe(true)
  })
  test('returns false if the "disabled" property evaluates to false', () => {
    const result = evaluateDisabled({ disabled: () => false }, {})
    expect(result).toBe(false)
  })
  test('returns true if the "disabled" property evaluates to true', () => {
    const result = evaluateDisabled({ disabled: () => true }, {})
    expect(result).toBe(true)
  })
  test('the evaluator function is called with the action as the argument', () => {
    const fakeEvaluator = jest.fn<() => boolean>().mockReturnValue(true)
    const uniqueArgument = {type: 'ContextAction'}
    const result = evaluateDisabled({ disabled: fakeEvaluator }, uniqueArgument)
    expect(fakeEvaluator).toHaveBeenCalledTimes(1)
    expect(fakeEvaluator).toHaveBeenCalledWith(uniqueArgument)
  })
})