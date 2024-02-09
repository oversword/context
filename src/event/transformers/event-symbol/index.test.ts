import eventSymbol from "."
import {expect, describe, test} from '@jest/globals';

describe('eventSymbol', () => {
  test('gets the symbol from a keyboard letter event', () => {
    const keys = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('')
    keys.forEach((key) => {
      const result = eventSymbol({
        code: `Key${key}`
      } as KeyboardEvent)
  
      expect(result).toBe(key)
    })
  })
  test('gets the symbol from a keyboard number event, ignoring the source position', () => {
    const keys = ('0123456789').split('')
    keys.forEach((key) => {
      const result1 = eventSymbol({
        code: `Digit${key}`
      } as KeyboardEvent)
      const result2 = eventSymbol({
        code: `Numpad${key}`
      } as KeyboardEvent)
  
      expect(result1).toBe(key)
      expect(result2).toBe(key)
    })
  })
  test('returns an unknown symbol directly', () => {
    const keys = ('[;#').split('')
    keys.forEach((key) => {
      const result = eventSymbol({
        code: key
      } as KeyboardEvent)
  
      expect(result).toBe(key)
    })
  })
  test('maps any unknown symbol from the symbolMap', () => {
    const symbolMap = {
      '[': '/',
      ';': '0',
      '#': '-'
    }
    const keys = ('[;#').split('')
    keys.forEach((key) => {
      const result = eventSymbol({
        code: key
      } as KeyboardEvent, symbolMap)
  
      expect(result).toBe(symbolMap[key])
    })
  })
})