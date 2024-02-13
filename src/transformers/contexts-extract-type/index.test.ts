import contextsExtractType from '.'
import {expect, describe, test} from '@jest/globals'
import { StoreMeta } from 'types/index.types'

describe('contextsExtractType', () => {
	test('extracts the type of a context', () => {
		const result = contextsExtractType([
			{
				config: {
					type: 'contextType'
				}
			} as StoreMeta
		])
		expect(result).toEqual('contextType')
	})
	test('skips any contexts that have no type', () => {
		const result = contextsExtractType([
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
		expect(result).toEqual('contextType')
	})
	test('finds the first context with a type', () => {
		const result = contextsExtractType([
			{
				config: {
				}
			} as StoreMeta,
			{
				config: {
					type: 'childContext'
				}
			} as StoreMeta,
			{
				config: {
				}
			} as StoreMeta,
			{
				config: {
					type: 'parentContext'
				}
			} as StoreMeta,
			{
				config: {
				}
			} as StoreMeta,
		])
		expect(result).toEqual('childContext')
	})
})