import menuApplyConditions from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction } from '@/types/index.types'

describe('menuApplyConditions', () => {
	test('filters for menu that have a correlated action', () => {
		const result = menuApplyConditions([
			{action: 'goodAction', label: 'Valid'},
			{action: 'badAction', label: 'Invalid'},
		], {
			goodAction: {}
		}, {} as ContextAction)
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
		])
	})
	test('applied disabled flags if they exist', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const conditionMock = jest.fn().mockReturnValue(true)
		const result = menuApplyConditions([
			{action: 'goodAction', label: 'Valid'},
			{action: 'conditionalAction', label: 'Maybe'},
		], {
			goodAction: {},
			conditionalAction: {
				disabled: conditionMock
			}
		}, action)
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
			{action: 'conditionalAction', label: 'Maybe', disabled: true},
		])
		expect(conditionMock).toHaveBeenCalledTimes(1)
		expect(conditionMock).toHaveBeenCalledWith(action)
	})
	test('applies action conditions if they exist, filter out falsey', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const conditionMock = jest.fn().mockReturnValue(false)
		const result = menuApplyConditions([
			{action: 'goodAction', label: 'Valid'},
			{action: 'badAction', label: 'Invalid'},
			{action: 'conditionalAction', label: 'Maybe'},
		], {
			goodAction: {},
			conditionalAction: {
				condition: conditionMock
			}
		}, action)
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
		])
		expect(conditionMock).toHaveBeenCalledTimes(1)
		expect(conditionMock).toHaveBeenCalledWith(action)
	})
	test('applies action conditions if they exist, allow truthy', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const conditionMock = jest.fn().mockReturnValue(true)
		const result = menuApplyConditions([
			{action: 'goodAction', label: 'Valid'},
			{action: 'badAction', label: 'Invalid'},
			{action: 'conditionalAction', label: 'Maybe'},
		], {
			goodAction: {},
			conditionalAction: {
				condition: conditionMock
			}
		}, action)
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
			{action: 'conditionalAction', label: 'Maybe'},
		])
		expect(conditionMock).toHaveBeenCalledTimes(1)
		expect(conditionMock).toHaveBeenCalledWith(action)
	})
	test('applies conditions recursively', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const result = menuApplyConditions([
			{action: 'goodAction', label: 'Valid'},
			{action: 'badAction', label: 'Invalid'},
			{label: 'Parent', children: [
				{action: 'goodAction2', label: 'Valid'},
				{action: 'badAction2', label: 'Invalid'},
			]},
		], {
			goodAction: {},
			goodAction2: {
				disabled: true
			},
		}, action)
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
			{label: 'Parent', children: [
				{action: 'goodAction2', label: 'Valid', disabled: true},
			]},
		])
	})
})