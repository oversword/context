import shallowMatch from '.'
import {expect, describe, test} from '@jest/globals'

describe('shallowMatch', () => {
	test('matches two identical lists', () => {
		const result = shallowMatch(['a','b','c'], ['a','b','c'])
		expect(result).toBe(true)
	})
	test('matches two lists with the same items in different orders', () => {
		const result = shallowMatch(['a','b','c','d'], ['b', 'd', 'a', 'c'])
		expect(result).toBe(true)
	})
	test('matches two lists with the same unique items in different orders', () => {
		const u1 = {}
		const u2 = []
		const u3 = () => {}
		const u4 = Symbol('unique')

		const result = shallowMatch([u1,u2,u3,u4], [u3, u1, u4, u2])
		expect(result).toBe(true)
	})
	test('does not match to different lists', () => {
		const result1 = shallowMatch(['a','b','c'], ['a','b'])
		const result2 = shallowMatch(['a','b'], ['a','b','c'])
		expect(result1).toBe(false)
		expect(result2).toBe(false)
	})
	test('does not deep match complex items within lists', () => {
		const result = shallowMatch(['a','b',['c','d']], ['a','b',['c','d']])
		expect(result).toBe(false)
	})
})