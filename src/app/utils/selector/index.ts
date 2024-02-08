import { ContextTypeList, ContextSelector } from '../../types/index.types'
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
export const pathExtract = (
	string: ContextSelector,
): {
  stack: SelectorParserStack;
  path: ContextSelector;
} => {
	const endContext = [...string, PATHEXTRACT_LIST_END].reduce(pathExtractReduce, {
		mode: SelectorParserMode.operator,
		operator: SelectorParserOperator.inside,
		selector: '',
		stack: [],
	})
	return {
		stack: endContext.stack,
		path: string,
	}
}
const pathMapString = (step: string): string => `/${step}`
const PATH_GENERIC_SELECTOR = '(/[^/]+)'
const patternMapRegex = (step: SelectorParserStackItem): string => {
	const selector = step.selector === '*' ? PATH_GENERIC_SELECTOR : `(/${step.selector})`
	if (step.operator === SelectorParserOperator.direct) return selector
	return `${PATH_GENERIC_SELECTOR}*${selector}`
}
export const pathMatch = (
	path: ContextTypeList,
): ((pattern: ReturnType<typeof pathExtract>) => boolean) => {
	const pathStr = path.map(pathMapString).join('')
	return (pattern: ReturnType<typeof pathExtract>): boolean =>
		Boolean(pathStr.match(new RegExp(`^${pattern.stack.map(patternMapRegex).join('')}$`)))
}
