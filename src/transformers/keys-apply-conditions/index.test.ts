import keysApplyConditions from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction } from '../../types/index.types'

describe('keysApplyConditions', () => {
	test('filters for keys that have a correlated action', () => {
		const result = keysApplyConditions({
			goodKeys: ['a','b'],
			badKeys: ['c','d'],
		}, {
			goodKeys: {}
		}, {} as ContextAction)
		expect(result).toEqual({
			goodKeys: ['a','b'],
		})
	})
	test('applies action conditions if they exist, filter out falsey', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const conditionMock = jest.fn().mockReturnValue(false)
		const result = keysApplyConditions({
			goodKeys: ['a','b'],
			badKeys: ['c','d'],
			conditionalKeys: ['e','f'],
		}, {
			goodKeys: {},
			conditionalKeys: {
				condition: conditionMock
			}
		}, action)
		expect(result).toEqual({
			goodKeys: ['a','b'],
		})
		expect(conditionMock).toHaveBeenCalledTimes(1)
		expect(conditionMock).toHaveBeenCalledWith(action)
	})
	test('applies action conditions if they exist, allow truthy', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const conditionMock = jest.fn().mockReturnValue(true)
		const result = keysApplyConditions({
			goodKeys: ['a','b'],
			badKeys: ['c','d'],
			conditionalKeys: ['e','f'],
		}, {
			goodKeys: {},
			conditionalKeys: {
				condition: conditionMock
			}
		}, action)
		expect(result).toEqual({
			goodKeys: ['a','b'],
			conditionalKeys: ['e','f'],
		})
		expect(conditionMock).toHaveBeenCalledTimes(1)
		expect(conditionMock).toHaveBeenCalledWith(action)
	})
})