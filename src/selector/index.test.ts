import selector from '.'
import {expect, describe, test} from '@jest/globals'

describe('selector', () => {
	test('matches a selector string with itself', () => {
		const result = selector(['my-item'])(['my-item'])
		expect(typeof result).toBe('number')
		expect(Number(result) > 0).toBe(true)
	})
	test('matches a direct selector string with itself', () => {
		const result = selector(['my-item'])(['> my-item'])
		expect(typeof result).toBe('number')
		expect(Number(result) > 0).toBe(true)
	})
	test('does not match a direct selector string with itself when there is a parent', () => {
		const result = selector(['parent', 'my-item'])(['> my-item'])
		expect(result).toBe(false)
	})
	test('matches a selector string within a list of direct ancestors', () => {
		const result = selector(['parent','my-item'])(['my-item'])
		expect(typeof result).toBe('number')
		expect(Number(result) > 0).toBe(true)
	})
	test('matches a selector string for a direct ancestor within a list of direct ancestors', () => {
		const result = selector(['parent','my-item'])(['parent > my-item'])
		expect(typeof result).toBe('number')
		expect(Number(result) > 0).toBe(true)
	})
	test('does match a selector string for a direct ancestor when the list has indirect ancestors', () => {
		const result = selector(['parent', 'indirect', 'my-item'])(['parent > my-item'])
		expect(result).toBe(false)
	})
	test('matches a space-separated selector string for an indirect ancestor when the list has indirect ancestors', () => {
		const result = selector(['parent', 'indirect', 'my-item'])(['parent my-item'])
		expect(typeof result).toBe('number')
		expect(Number(result) > 0).toBe(true)
	})
	test('matches a slash-separated selector string for an indirect ancestor when the list has indirect ancestors', () => {
		const result = selector(['parent', 'indirect', 'my-item'])(['parent / my-item'])
		expect(typeof result).toBe('number')
		expect(Number(result) > 0).toBe(true)
	})
	test('matches a tab-separated selector string for an indirect ancestor when the list has indirect ancestors', () => {
		const result = selector(['parent', 'indirect', 'my-item'])(['parent\tmy-item'])
		expect(typeof result).toBe('number')
		expect(Number(result) > 0).toBe(true)
	})
	test('matches a tab-separated selector string for an indirect wildcard', () => {
		const result1 = selector(['parent', 'my-item'])(['parent *'])
		expect(typeof result1).toBe('number')
		expect(Number(result1) > 0).toBe(true)
    
		const result2 = selector(['parent', 'indirect', 'my-item'])(['parent *'])
		expect(typeof result2).toBe('number')
		expect(Number(result2) > 0).toBe(true)
	})
	test('matches a complex selector', () => {
		const result = selector(['a', 'b', 'c', 'd' ,'e', 'f', 'g'])(['> a b > * e * g'])
		expect(typeof result).toBe('number')
		expect(Number(result) > 0).toBe(true)
	})
})