import contextsDecideData from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction, StoreMeta } from '@/types/index.types'
import defaultConfiguration from '@/system/default-config'

const defaultStoreContext = {
	outercept: {},
	intercept: {},
	id: '0',
	root: true,
	parent: null,
	data: null,
}
describe('contextsDecideData', () => {
	test('returns the data options when defined in a context', () => {
		const dataObject = {
			uniqueKey: 'test'
		}
		const result = contextsDecideData(defaultConfiguration, [{
			...defaultStoreContext,
			config: {
				type: 'contextType',
				data: dataObject
			},
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual(dataObject)
	})
	test('Parent overrides Child: merges and overrides data configs when defined in both the parent and child', () => {
		const result = contextsDecideData(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				data: {
					childKey: 'test',
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				overrides: {
					contextType: {
						data: {
							childKey: 'override',
							parentKey: 'merge',
						}
					}
				},
			}
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual({
			childKey: 'override',
			parentKey: 'merge',
		})
	})
	test('Parent overrides Child: calls data generation methods, parent first when provided', () => {
		const parentData = {
			parentKey: 'test',
		}
		const childData = {
			childKey: 'test'
		}
		const contextDataGen = jest.fn().mockReturnValue(childData)
		const parentDataGen = jest.fn().mockReturnValue(parentData)
		const action = {path:['parentType', 'contextType']} as ContextAction
		const result = contextsDecideData(defaultConfiguration, [{
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
				overrides: {
					contextType: {
						data: parentDataGen
					}
				}
			},
		} as StoreMeta], action)

		expect(result).toEqual(parentData)
		expect(parentDataGen).toHaveBeenCalledTimes(1)
		expect(contextDataGen).toHaveBeenCalledTimes(1)
		expect(parentDataGen).toBeCalledWith(action, childData)
		expect(contextDataGen).toBeCalledWith(action, {})
	})
})