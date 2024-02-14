import splitCombination from '.'
import {expect, describe, test} from '@jest/globals'

describe('splitCombination', () => {
	test('converts a string to an array', () => {
		const result = splitCombination('string')
		expect(result).toEqual(['string'])
	})
	test('splits the string by the Plus (+) separator', () => {
		const result = splitCombination('st+r+in+g')
		expect(result).toEqual(['st','r','in','g'])
	})
})