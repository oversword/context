import evaluateCondition from '.'
import {expect, describe, test, jest} from '@jest/globals'

describe('evaluateCondition', () => {
	test('returns false if the conditional is false', () => {
		const result = evaluateCondition(false, {})
		expect(result).toBe(false)
	})
	test('returns false if the conditional is null', () => {
		const result = evaluateCondition(null, {})
		expect(result).toBe(false)
	})
	test('returns false if the conditional is undefined', () => {
		const result = evaluateCondition(undefined, {})
		expect(result).toBe(false)
	})
	test('returns true if the conditional has no "condition" property', () => {
		const result = evaluateCondition({}, {})
		expect(result).toBe(true)
	})
	test('returns false if the "condition" property is false', () => {
		const result = evaluateCondition({ condition: false }, {})
		expect(result).toBe(false)
	})
	test('returns true if the "condition" property is true', () => {
		const result = evaluateCondition({ condition: true }, {})
		expect(result).toBe(true)
	})
	test('returns false if the "condition" property evaluates to false', () => {
		const result = evaluateCondition({ condition: () => false }, {})
		expect(result).toBe(false)
	})
	test('returns true if the "condition" property evaluates to true', () => {
		const result = evaluateCondition({ condition: () => true }, {})
		expect(result).toBe(true)
	})
	test('the evaluator function is called with the action as the argument', () => {
		const fakeEvaluator = jest.fn<() => boolean>().mockReturnValue(true)
		const uniqueArgument = {type: 'ContextAction'}
		evaluateCondition({ condition: fakeEvaluator }, uniqueArgument)
		expect(fakeEvaluator).toHaveBeenCalledTimes(1)
		expect(fakeEvaluator).toHaveBeenCalledWith(uniqueArgument)
	})
})