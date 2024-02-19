import contextsDecideKeys from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction, StoreMeta } from '@/types/index.types'

const defaultStoreContext = {
	outercept: {},
	intercept: {},
	id: '0',
	root: true,
	parent: null,
}
describe('contextsDecideKeys', () => {
	test('returns the keys options when defined in a context', () => {
		const dataObject = {
			uniqueKey: ['test']
		}
		const result = contextsDecideKeys([{
			...defaultStoreContext,
			config: {
				type: 'contextType',
				keys: dataObject
			},
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual(dataObject)
	})
	test('Parent overrides Child: merges and overrides keys configs when defined in both the parent and child', () => {
		const result = contextsDecideKeys([{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				keys: {
					childKey: ['test']
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				keys: {
					childKey: ['override'],
					parentKey: ['merge'],
				}
			},
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual({
			childKey: ['override'],
			parentKey: ['merge'],
		})
	})
})