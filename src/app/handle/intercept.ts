import {
	StoreMeta,
	ContextAction,
	ContextActionName,
	ContextInterceptConfig,
	ContextIntercept,
	ContextTypeList,
	ContextSelector,
	StoreMetaList,
} from '../types/index.types'
import { pathExtract, pathMatch } from '../utils/selector'
import filterTruthy from '../../array/iterators/filter-truthy'
import contextsExtractPath from '../transformers/contexts-extract-path'
import { ActionDefinition, InterceptDefinition } from '../types/intercept.types'
import evaluateCondition from '../conditions/evaluate-condition'
import evaluateAction from '../conditions/evaluate-action'

const findIntercept =
	(action: ContextAction) =>
		(
			found: ContextActionName | ContextIntercept | false,
			{ callback }: InterceptDefinition,
		): ContextActionName | ContextIntercept | false => {
			if (found) return found
			if (typeof callback === 'string') return callback
			if ('condition' in callback && !evaluateCondition(callback, action)) return false
			if (typeof callback === 'function') return callback
			if ('action' in callback) {
				return evaluateAction(callback, action) || false
			}
			if ('method' in callback) return callback.method
			return callback
		}
const getInterceptDefinitions = (
	action: ContextActionName,
	path: ContextTypeList,
): (([key, callback]: [ContextSelector, ContextInterceptConfig]) => InterceptDefinition | void) => {
	const matchPath = pathMatch(path)
	return ([key, callback]: [
	ContextSelector,
	ContextInterceptConfig,
]): InterceptDefinition | void => {
		const [type, act] = key.split('.')
		if (act !== action) return undefined
		const typeObj = pathExtract(type)
		if (!matchPath(typeObj)) return undefined
		return { path: typeObj.stack, callback }
	}
}
const getIntercept =
	(contexts: StoreMetaList, { action, type, data, event }) =>
		(cept: 'intercept' | 'outercept'): ActionDefinition | ContextIntercept | false =>
			(cept === 'intercept' ? contexts : [...contexts].reverse()).reduce(
				(
					found: ActionDefinition | ContextIntercept | false,
					context: StoreMeta,
					index: number,
					list: StoreMetaList,
				): ActionDefinition | ContextIntercept | false => {
					if (found) return found
					const intercept = context[cept]
					if (!intercept) return found

					const path = contextsExtractPath(
						cept === 'intercept' ? list.slice(0, index + 1) : list.slice(index).reverse(),
					)

					const actionKeys = Object.entries(intercept || {})
						.map(getInterceptDefinitions(action, path))
						.filter(filterTruthy) as Array<InterceptDefinition>
					actionKeys.sort((a, b) => b.path.length - a.path.length)

					const justFound = actionKeys.reduce(
						findIntercept({ action, path, type, data, event }),
						false,
					)
					if (justFound) {
						if (typeof justFound === 'string') {
							return {
								id: context.id,
								action: justFound,
							}
						}
						return justFound
					}

					return false
				},
				false,
			)

export default getIntercept
