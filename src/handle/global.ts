import { ContextKeyEvent } from '@/types/index.types'
import contextsExtractType from '@/transformers/contexts-extract-type'
import contextsExtractPath from '@/transformers/contexts-extract-path'
import contextsDecideData from '@/transformers/contexts-decide-data'
import contextsDecideKeysAction from '@/transformers/contexts-decide-keys-action'
import { handleNamedAction } from './action'
import { inactiveLog as log } from '@/side-effects/debug-log'
import { ContextSystemApi } from '@/types/system.types'
import { UNHANDLED } from '@/constants/handled'

const contextHandleGlobalEvent = (
	contextSystemApi: ContextSystemApi,
	event: ContextKeyEvent,
): symbol | Promise<unknown> => {
	log('contextHandleGlobalEvent', event)
	const allContexts = contextSystemApi.getContexts(contextSystemApi.focussedContext)
	log('contextHandleGlobalEvent', allContexts)
	for (let c = 0; c < allContexts.length; c++) {
		const contexts = allContexts.slice(c)
		const { id } = contexts[0]
		log('contextHandleGlobalEvent', { id, contexts })

		const type = contextsExtractType(contexts)
		const path = contextsExtractPath(contexts)
		const data = contextsDecideData(contexts, { path, type, event })

		const combinationAction = contextsDecideKeysAction(contexts, { path, type, data, event })
		log('contextHandleGlobalEvent', { id, combinationAction })

		const inputHandled = handleNamedAction(contextSystemApi, contexts, 'input', {
			path,
			type,
			data,
			event: {
				...event,
				combinationAction,
			},
		})
		if (inputHandled !== UNHANDLED) return inputHandled

		if (combinationAction) {
			const combinationHandled = handleNamedAction(contextSystemApi, contexts, combinationAction, {
				path,
				type,
				data,
				event,
			})
			if (combinationHandled !== UNHANDLED) return combinationHandled
		}
	}
	return UNHANDLED
}

export default contextHandleGlobalEvent
