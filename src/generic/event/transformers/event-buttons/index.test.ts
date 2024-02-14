import eventButtons from '.'
import {expect, describe, test} from '@jest/globals'

describe('eventButtons', () => {
	test('it extracts the mouse buttons as switches from a MouseEvent (by converting a number `buttons` to its binary represetnation as an array of booleans)', () => {
		const numbers = [
			[false,false,false,false,false],
			[true,false,false,false,false],
			[false,true,false,false,false],
			[true,true,false,false,false],
			[false,false,true,false,false],
			[true,false,true,false,false],
			[false,true,true,false,false],
			[true,true,true,false,false],
			[false,false,false,true,false],
			[true,false,false,true,false],
			[false,true,false,true,false],
			[true,true,false,true,false],
			[false,false,true,true,false],
			[true,false,true,true,false],
			[false,true,true,true,false],
			[true,true,true,true,false],
			[false,false,false,false,true],
			[true,false,false,false,true],
			[false,true,false,false,true],
			[true,true,false,false,true],
			[false,false,true,false,true],
			[true,false,true,false,true],
			[false,true,true,false,true],
			[true,true,true,false,true],
			[false,false,false,true,true],
			[true,false,false,true,true],
			[false,true,false,true,true],
			[true,true,false,true,true],
			[false,false,true,true,true],
			[true,false,true,true,true],
			[false,true,true,true,true],
			[true,true,true,true,true],
		]
		numbers.forEach((binary, number) => {
			const result = eventButtons({ buttons: number } as MouseEvent)
			expect(result).toEqual(binary)
		})
	})
})