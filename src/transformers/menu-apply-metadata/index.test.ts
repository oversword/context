import menuApplyActData from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction, ContextMenuItemMode } from '@/types/index.types'

describe('menuApplyMetaData', () => {
	test('applies keys recursively', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const result = menuApplyActData([
			{action: 'goodAction', label: 'Keys'},
			{action: 'badAction', label: 'No Keys'},
			{mode: ContextMenuItemMode.section,label: 'Parent', children: [
				{action: 'goodAction2', label: 'Keys'},
				{action: 'badAction2', label: 'No Keys'},
			]},
		], action, {
			goodAction: {
				keys: ['a','b']
			},
			goodAction2: {
				keys: ['c','d']
			}
		})
		expect(result).toEqual([
			{action: 'goodAction', label: 'Keys',keys:['a','b'],disabled: false},
			{action: 'badAction', label: 'No Keys',keys:[],disabled: false},
			{label: 'Parent', keys: [], disabled: false, mode: ContextMenuItemMode.section, children: [
				{action: 'goodAction2', label: 'Keys', keys:['c','d'],disabled: false},
				{action: 'badAction2', label: 'No Keys',keys:[],disabled: false},
			]},
		])
	})
	test('applied disabled flags if they exist', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const conditionMock = jest.fn().mockReturnValue(true)
		const result = menuApplyActData([
			{action: 'goodAction', label: 'Valid'},
			{action: 'conditionalAction', label: 'Maybe'},
		], action, {
			goodAction: {},
			conditionalAction: {
				disabled: conditionMock
			}
		})
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid', disabled: false, keys: []},
			{action: 'conditionalAction', label: 'Maybe', disabled: true, keys: []},
		])
		expect(conditionMock).toHaveBeenCalledTimes(1)
		expect(conditionMock).toHaveBeenCalledWith(action)
	})
	test('applies conditions recursively', () => {
		const action = { type: 'uniqeAction' } as ContextAction
		const result = menuApplyActData([
			{action: 'goodAction', label: 'Valid'},
			{label: 'Parent', mode: ContextMenuItemMode.section, children: [
				{action: 'goodAction2', label: 'Valid'},
			]},
		], action, {
			goodAction: {},
			goodAction2: {
				disabled: true
			},
		})
		expect(result).toEqual([
			{action: 'goodAction', label: 'Valid', keys: [], disabled: false, },
			{label: 'Parent', mode: ContextMenuItemMode.section, keys: [], disabled: false, children: [
				{action: 'goodAction2', label: 'Valid', disabled: true,  keys: []},
			]},
		])
	})
})
// })
// import menuApplyConditions from '.'
// import {expect, describe, test} from '@jest/globals'
// import { ContextAction } from '@/types/index.types'

// describe('menuApplyConditions', () => {
// 	test('filters for menu that have a correlated action', () => {
// 		const result = menuApplyConditions([
// 			{action: 'goodAction', label: 'Valid'},
// 			{action: 'badAction', label: 'Invalid'},
// 		], {
// 			goodAction: {}
// 		}, {} as ContextAction)
// 		expect(result).toEqual([
// 			{action: 'goodAction', label: 'Valid'},
// 		])
// 	})
// 	test('applies action conditions if they exist, filter out falsey', () => {
// 		const action = { type: 'uniqeAction' } as ContextAction
// 		const conditionMock = jest.fn().mockReturnValue(false)
// 		const result = menuApplyConditions([
// 			{action: 'goodAction', label: 'Valid'},
// 			{action: 'badAction', label: 'Invalid'},
// 			{action: 'conditionalAction', label: 'Maybe'},
// 		], {
// 			goodAction: {},
// 			conditionalAction: {
// 				condition: conditionMock
// 			}
// 		}, action)
// 		expect(result).toEqual([
// 			{action: 'goodAction', label: 'Valid'},
// 		])
// 		expect(conditionMock).toHaveBeenCalledTimes(1)
// 		expect(conditionMock).toHaveBeenCalledWith(action)
// 	})
// 	test('applies action conditions if they exist, allow truthy', () => {
// 		const action = { type: 'uniqeAction' } as ContextAction
// 		const conditionMock = jest.fn().mockReturnValue(true)
// 		const result = menuApplyConditions([
// 			{action: 'goodAction', label: 'Valid'},
// 			{action: 'badAction', label: 'Invalid'},
// 			{action: 'conditionalAction', label: 'Maybe'},
// 		], {
// 			goodAction: {},
// 			conditionalAction: {
// 				condition: conditionMock
// 			}
// 		}, action)
// 		expect(result).toEqual([
// 			{action: 'goodAction', label: 'Valid'},
// 			{action: 'conditionalAction', label: 'Maybe'},
// 		])
// 		expect(conditionMock).toHaveBeenCalledTimes(1)
// 		expect(conditionMock).toHaveBeenCalledWith(action)
// 	})
// 	test('applies conditions recursively', () => {
// 		const action = { type: 'uniqeAction' } as ContextAction
// 		const result = menuApplyConditions([
// 			{action: 'goodAction', label: 'Valid'},
// 			{action: 'badAction', label: 'Invalid'},
// 			{label: 'Parent', children: [
// 				{action: 'goodAction2', label: 'Valid'},
// 				{action: 'badAction2', label: 'Invalid'},
// 			]},
// 		], {
// 			goodAction: {},
// 			goodAction2: {
// 				disabled: true
// 			},
// 		}, action)
// 		expect(result).toEqual([
// 			{action: 'goodAction', label: 'Valid'},
// 			{label: 'Parent', children: [
// 				{action: 'goodAction2', label: 'Valid', disabled: true},
// 			]},
// 		])
// 	})
// })