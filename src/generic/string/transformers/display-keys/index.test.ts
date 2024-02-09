import displayKeys from '.'
import {expect, describe, test} from '@jest/globals'

describe('displayKeys', () => {
	test('converts a list of string to a string', () => {
		const result = displayKeys(['string'])
		expect(result).toBe('string')
	})
	test('joins a list of strings by commas, with spaces', () => {
		const result = displayKeys(['string', 'another', 'again'])
		expect(result).toBe('string, another, again')
	})
	test('replaces Plusses (+) with dots (•)', () => {
		const result = displayKeys(['string+another+again'])
		expect(result).toBe('string•another•again')
	})
	test('replaces Plusses (+) with dots (•) for multiple items', () => {
		const result = displayKeys(['string+another+again','another+plus+list'])
		expect(result).toBe('string•another•again, another•plus•list')
	})
	test('swaps items from the list to the iconMap', () => {
		const result = displayKeys(['string'], {'string':'something-else'})
		expect(result).toBe('something-else')
	})
	test('swaps items from the list to the iconMap for multiple items', () => {
		const result = displayKeys(['string+another+again','another+plus+list'], {'string':'something-else','list':'transformed'})
		expect(result).toBe('something-else•another•again, another•plus•transformed')
	})
})