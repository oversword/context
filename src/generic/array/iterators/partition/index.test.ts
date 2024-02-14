import partition from '.'
import {expect, describe, test} from '@jest/globals'

describe('partition', () => {
	test('splits a list by a predicate into [falseResults, trueResults]', () => {
		const result = partition([1,2,3,4,5, false, null, undefined, 0], Boolean)

		expect(result).toEqual([
			[false, null, undefined, 0],
			[1,2,3,4,5],
		])
	})
	test('splits a list by a complex predicate, preserving order', () => {
		const keyword = 'cat'
		const result = partition(['a','b','c','d','e','f'], (key) => keyword.includes(key))

		expect(result).toEqual([
			['b','d','e','f'],
			['a', 'c'],
		])
	})
})