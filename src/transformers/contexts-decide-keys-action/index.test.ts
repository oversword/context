import defaultConfiguration from '@/system/default-config'
import contextsDecideKeysAction from '.'
import {expect, describe, test} from '@jest/globals'

const defaultStoreContext = {
	outercept: {},
	intercept: {},
	id: '0',
	root: true,
	parent: null,
}
describe('contextsDecideKeysAction', () => {
	test('matches key combinations on the triggered context', () => {
		const result = contextsDecideKeysAction(defaultConfiguration, [
			{
				...defaultStoreContext,
				config: {
					type: 'test-context',
					acts: {
						'test-action': {
							keys: ['Ctrl+U'],
						},
						'conditonal-action': {
							condition: () => false,
							keys: ['Ctrl+U']
						}
					},
				}
			}
		], { type: 'test-context', path: ['test-context'], data: {}, event: { combination: ['Ctrl','U'] } })

		expect(result).toBe('test-action')
	})
})