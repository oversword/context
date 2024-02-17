import contextsDecideData from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction, StoreMeta } from '@/types/index.types'

const defaultStoreContext = {
	outercept: {},
	intercept: {},
	id: '0',
	root: true,
	parent: null,
}
describe('contextsDecideData', () => {
	test('returns the data options when defined in a context', () => {
		const dataObject = {
			uniqueKey: 'test'
		}
		const result = contextsDecideData([{
			...defaultStoreContext,
			config: {
				type: 'contextType',
				data: dataObject
			},
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual(dataObject)
	})
	// TODO: This behaviour differs from transformer to transformer, should be standardised or reasoned
	test('Child overrides Parent: merges and overrides data configs when defined in both the parent and child', () => {
		const result = contextsDecideData([{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				data: {
					childKey: 'override'
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				data: {
					childKey: 'test',
					parentKey: 'merge',
				}
			},
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual({
			childKey: 'override',
			parentKey: 'merge',
		})
	})
	test('Child overrides Parent: calls data generation methods, parent first when provided', () => {
		const parentData = {
			parentKey: 'test',
		}
		const childData = {
			childKey: 'test'
		}
		const contextDataGen = jest.fn().mockReturnValue(childData)
		const parentDataGen = jest.fn().mockReturnValue(parentData)
		const action = {path:['parentType', 'contextType']} as ContextAction
		const result = contextsDecideData([{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				data: contextDataGen
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				data: parentDataGen
			},
		} as StoreMeta], action)

		expect(result).toEqual(childData)
		expect(parentDataGen).toHaveBeenCalledTimes(1)
		expect(contextDataGen).toHaveBeenCalledTimes(1)
		expect(contextDataGen).toBeCalledWith(action, parentData)
		expect(parentDataGen).toBeCalledWith(action, {})
	})
})