import evaluateCondition from '../app/conditions/evaluate-condition'
import evaluateAction from '../app/conditions/evaluate-action'
import {
	ContextAction,
	ContextActionName,
	ContextEvent,
	ContextId,
	ContextActionNameConfig,
} from '../types/index.types'
import contextsExtractType from '../contexts/transformers/extract-type'
import contextsExtractPath from '../contexts/transformers/extract-path'
import contextsDecideData from '../contexts/transformers/decide-data'
import { handleNamedAction } from './action'
import PartialOmit from '../types/partial-omit'
import { inactiveLog as log } from '../side-effects/debug-log'
import { ContextSystemApi } from '../types/system.types'

const getActionName = (
	onAction: ContextActionNameConfig,
	action: PartialOmit<ContextAction, 'action'>,
): ContextActionName | null => {
	if (typeof onAction === 'string') return onAction

	if ('condition' in onAction && !evaluateCondition(onAction, action)) return null

	return evaluateAction(onAction, action)
}

const contextHandleLocalEvent = (
	contextSystemApi: ContextSystemApi,
	id: ContextId,
	onAction: ContextActionNameConfig,
	event: ContextEvent,
): symbol | false | Promise<unknown> => {
	log('handle local event')
	const contexts = contextSystemApi.getContexts(id)

	const type = contextsExtractType(contexts)
	const path = contextsExtractPath(contexts)
	const data = contextsDecideData(contexts, { path, type, event })

	const action = getActionName(onAction, { data, type, path, event })

	return handleNamedAction(contextSystemApi, contexts, action, { path, data, type, event })
}
export default contextHandleLocalEvent
