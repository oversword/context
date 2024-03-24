import menuFilter from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction, ContextMenuItemMode } from '@/types/index.types'

describe('menuFilter', () => {
	test('filters for menu that have a correlated action', () => {
		const result = menuFilter([
			{action: 'goodAction', label: 'Valid'},
			{action: 'badAction', label: 'Invalid'},
		], {} as ContextAction, {
			goodAction: {}
		})
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
		])
	})
	test('applies action conditions if they exist, filter out falsey', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const conditionMock = jest.fn().mockReturnValue(false)
		const result = menuFilter([
			{action: 'goodAction', label: 'Valid'},
			{action: 'badAction', label: 'Invalid'},
			{action: 'conditionalAction', label: 'Maybe'},
		], action, {
			goodAction: {},
			conditionalAction: {
				condition: conditionMock
			}
		})
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
		])
		expect(conditionMock).toHaveBeenCalledTimes(1)
		expect(conditionMock).toHaveBeenCalledWith(action)
	})
	test('applies action conditions if they exist, allow truthy', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const conditionMock = jest.fn().mockReturnValue(true)
		const result = menuFilter([
			{action: 'goodAction', label: 'Valid'},
			{action: 'badAction', label: 'Invalid'},
			{action: 'conditionalAction', label: 'Maybe'},
		], action, {
			goodAction: {},
			conditionalAction: {
				condition: conditionMock
			}
		})
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
			{action: 'conditionalAction', label: 'Maybe'},
		])
		expect(conditionMock).toHaveBeenCalledTimes(1)
		expect(conditionMock).toHaveBeenCalledWith(action)
	})
	test('applies conditions recursively', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const result = menuFilter([
			{action: 'goodAction', label: 'Valid'},
			{action: 'badAction', label: 'Invalid'},
			{mode: ContextMenuItemMode.section, label: 'Parent', children: [
				{action: 'goodAction2', label: 'Valid'},
				{action: 'badAction2', label: 'Invalid'},
			]},
		], action, {
			goodAction: {},
			goodAction2: {
				disabled: true
			},
		})
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid'},
			{label: 'Parent', mode: 'section', children: [
				{action: 'goodAction2', label: 'Valid'},
			]},
		])
	})
})