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
		const result = contextsDecideKeysAction([
			{
				...defaultStoreContext,
				config: {
					type: 'test-context',
					acts: {
						'test-context': {
							'test-action': {},
							'conditonal-action': {
								condition: () => false
							}
						}
					},
					keys: {
						'test-action': ['Ctrl+U'],
						'other-action': ['Ctrl+Shift+U'],
						'conditional-action': ['Ctrl+U'],
					}
				}
			}
		], { type: 'test-context', path: ['test-context'], data: {}, event: { combination: ['Ctrl','U'] } })

		expect(result).toBe('test-action')
	})
})