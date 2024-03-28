import eventChar from '.'
import {expect, describe, test} from '@jest/globals'

describe('eventChar', () => {
	test('returns the printable charachter from a keyboard event', () => {
		const keys = ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!"£$%^&*()[]{};:,.?|').split('')
		keys.forEach((key) => {
			const result = eventChar({
				key
			} as KeyboardEvent)

			expect(result).toBe(key)
		})
	})
	test('returns en empty string if the key us unmatched', () => {
		const result = eventChar({
			key: 'something-random'
		} as KeyboardEvent)

		expect(result).toBe('')
	})
	test('maps the key to the charMap', () => {
		const result = eventChar({
			key: 'SpaceKey'
		} as KeyboardEvent, {
			SpaceKey: ' '
		})

		expect(result).toBe(' ')
	})
})