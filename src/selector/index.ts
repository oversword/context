import { ContextTypeList, ContextSelector } from '@/types/index.types'
import {
	SelectorParserContext,
	SelectorParserMode,
	SelectorParserOperator,
	SelectorParserStack,
	SelectorParserStackItem,
} from './index.types'

const PATHEXTRACT_LIST_END = Symbol('PATHEXTRACT_LIST_END')

const pathExtractReduce = (
	context: SelectorParserContext,
	char: string | symbol,
): SelectorParserContext => {
	switch (char) {
	case '/':
	case ' ':
	case '\t':
		if (context.mode === SelectorParserMode.operator)
		// && context.operator === 'direct')
			return context

		return {
			...context,
			stack: [
				...context.stack,
				{
					operator: context.operator,
					selector: context.selector,
				},
			],
			mode: SelectorParserMode.operator,
			operator: SelectorParserOperator.inside,
			selector: '',
		}
	case '>':
		return {
			...context,
			stack: context.mode === SelectorParserMode.operator
				? context.stack
				: [
					...context.stack,
					{
						operator: context.operator,
						selector: context.selector,
					},
				],
			mode: SelectorParserMode.operator,
			operator: SelectorParserOperator.direct,
			selector: '',
		}
	case '*':
		if (context.mode !== SelectorParserMode.operator) console.warn('Invalid use of wildcard.')
		return {
			...context,
			stack: [
				...context.stack,
				{
					operator: context.mode === SelectorParserMode.operator
						? context.operator
						: SelectorParserOperator.inside,
					selector: '*',
				},
			],
			mode: SelectorParserMode.operator,
			operator: SelectorParserOperator.inside,
			selector: '',
		}
	case PATHEXTRACT_LIST_END:
		return {
			...context,
			stack: context.mode === SelectorParserMode.operator
				? context.stack
				: [
					...context.stack,
					{
						operator: context.operator,
						selector: context.selector,
					},
				],
		}
	default:
		return {
			...context,
			mode: SelectorParserMode.selector,
			selector: context.selector + String(char),
		}
	}
}
const pathExtract = (
	string: ContextSelector,
): SelectorParserStack => {
	const endContext = [...string.split(''), PATHEXTRACT_LIST_END].reduce(pathExtractReduce, {
		mode: SelectorParserMode.operator,
		operator: SelectorParserOperator.inside,
		selector: '',
		stack: [],
	})
	return endContext.stack
}
const pathMapString = (step: string): string => `/${step}`
const PATH_GENERIC_SELECTOR = '(/[^/]+)'
const patternMapRegex = (step: SelectorParserStackItem): string => {
	const selector = step.selector === '*' ? PATH_GENERIC_SELECTOR : `(/${step.selector})`
	if (step.operator === SelectorParserOperator.direct) return selector
	return `${PATH_GENERIC_SELECTOR}*${selector}`
}
const pathMatch = (
	path: ContextTypeList,
	pattern: ReturnType<typeof pathExtract>
): boolean =>
	Boolean(path.map(pathMapString).join('').match(new RegExp(`^${pattern.map(patternMapRegex).join('')}$`)))

/**
 * Parses a selector string and checks if it matches the path
 * 
 * @param path [ 'myTag', 'directChild', 'container', 'indirectChild', 'somethingElse' ]
 * 
 * @param [string]
 * @param string in the format 'myTag > directChild indirectChild > *'
 * 
 * @returns false if no match
 * @returns number priority of match (bigger is better)
 */
const selectorMatch = (path: ContextTypeList) => ([string]: [string] | [string, unknown]): false | number => {
	const extractedPath = pathExtract(string)
	if (pathMatch(path, extractedPath))
		return extractedPath.length
	return false
}
export default selectorMatch
