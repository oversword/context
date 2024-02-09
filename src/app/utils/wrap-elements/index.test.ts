import { ReactElement } from "react";
import wrapElements from "."
import {expect, describe, test} from '@jest/globals';

describe('wrapElements', () => {
  test('it returns an array, unmodified', () => {
    const input = []
    const result = wrapElements(input)
    expect(result).toBe(input)
  })
  test('it returns an empty array if null is input', () => {
    const result = wrapElements(null)
    expect(result).toEqual([])
  })
  test('it wraps anything else in an array', () => {
    const obj = {}
    const result = wrapElements(obj as ReactElement)
    expect(result).toEqual([obj])
  })
})