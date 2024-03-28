import evaluateAction from '.'
import {expect, describe, test, jest} from '@jest/globals'

const testAction = { type: '', event: {}, data: {}, action: '', path: [] }
describe('evaluateAction', () => {
	test('returns the string if the "action" property is a string', () => {
		const result = evaluateAction({ action: 'string1' }, testAction)
		expect(result).toBe('string1')
	})
	test('returns the string if "action" property returns a string', () => {
		const result = evaluateAction({ action: () => 'string2' }, testAction)
		expect(result).toBe('string2')
	})
	test('returns the string if method returns a string', () => {
		const result = evaluateAction(() => 'string3', testAction)
		expect(result).toBe('string3')
	})
	test('calls generator methods with the provided action', () => {
		const actionYield1 = jest.fn<() => string>()
		const actionYield2 = jest.fn<() => string>()
		evaluateAction({ action: actionYield1 }, testAction)
		evaluateAction(actionYield2, testAction)

		expect(actionYield1).toHaveBeenCalledTimes(1)
		expect(actionYield1).toHaveBeenCalledWith(testAction)

		expect(actionYield2).toHaveBeenCalledTimes(1)
		expect(actionYield2).toHaveBeenCalledWith(testAction)
	})
})