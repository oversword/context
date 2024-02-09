import contextsExtractPath from "."
import {expect, describe, test} from '@jest/globals';
import { StoreMeta } from "../../types/index.types";

describe('contextsExtractPath', () => {
  test('extracts the types of contexts as a list of strings', () => {
    const result = contextsExtractPath([
      {
        config: {
          type: 'contextType'
        }
      } as StoreMeta
    ])
    expect(result).toEqual(['contextType'])
  })
  test('skips any contexts that have no type', () => {
    const result = contextsExtractPath([
      {
        config: {
        }
      } as StoreMeta,
      {
        config: {
        }
      } as StoreMeta,
      {
        config: {
        }
      } as StoreMeta,
      {
        config: {
          type: 'contextType'
        }
      } as StoreMeta,
      {
        config: {
        }
      } as StoreMeta,
      {
        config: {
        }
      } as StoreMeta,
      {
        config: {
        }
      } as StoreMeta,
    ])
    expect(result).toEqual(['contextType'])
  })
  test('reverses the order of the contexts', () => {
    const result = contextsExtractPath([
      {
        config: {
          type: 'childContext'
        }
      } as StoreMeta,
      {
        config: {
          type: 'parentContext'
        }
      } as StoreMeta,
    ])
    expect(result).toEqual(['parentContext', 'childContext'])
  })
})