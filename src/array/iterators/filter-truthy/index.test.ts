import filterTruty from '.'
import {expect, describe, test} from '@jest/globals'

describe('filterTruthy', () => {
	test('returns a boolean for any input', () => {
		const falseyInputs = [null, undefined,'',0,false]
		const truthyInputs = ['hi','0',1, true, () => {}, {}, []]
		falseyInputs.forEach(input => {
			const result = filterTruty(input)
			expect(result).toBe(false)
		})
		truthyInputs.forEach(input => {
			const result = filterTruty(input)
			expect(result).toBe(true)
		})
	})
	test('filters a list for truthy elements', () => {
		const list = [
			'a', false, 'b', null, 'c', undefined, 'd', 0, 'e', ''
		]
		const result = list.filter(filterTruty)
		expect(result).toEqual(['a','b','c','d','e'])
	})
})