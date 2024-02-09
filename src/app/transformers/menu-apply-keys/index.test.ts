import menuApplyKeys from "."
import {expect, describe, test} from '@jest/globals';
import { ContextAction } from "../../types/index.types";

describe('menuApplyKeys', () => {
  test('filters for menu that have a correlated action', () => {
    const result = menuApplyKeys([
      {action: 'goodAction', label: 'Keys'},
      {action: 'badAction', label: 'No Keys'},
    ], {
      goodAction: ['a','b']
    }, {} as ContextAction)
    expect(result).toEqual([
      {action: 'goodAction', label: 'Keys',keys:['a','b']},
      {action: 'badAction', label: 'No Keys'},
    ])
  })
  test('applies keys recursively', () => {
    const action = { type: 'uniqeAction' } as ContextAction
    const result = menuApplyKeys([
      {action: 'goodAction', label: 'Keys'},
      {action: 'badAction', label: 'No Keys'},
      {label: 'Parent', children: [
        {action: 'goodAction2', label: 'Keys'},
        {action: 'badAction2', label: 'No Keys'},
      ]},
    ], {
      goodAction: ['a','b'],
      goodAction2: ['c','d']
    }, action)
    expect(result).toEqual([
      {action: 'goodAction', label: 'Keys',keys:['a','b']},
      {action: 'badAction', label: 'No Keys'},
      {label: 'Parent', children: [
        {action: 'goodAction2', label: 'Keys', keys:['c','d']},
        {action: 'badAction2', label: 'No Keys'},
      ]},
    ])
  })
})