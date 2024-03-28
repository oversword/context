import {
	ContextAction,
	ContextActionName,
	ContextActionNameObject,
	ContextActionNameGenerator,
} from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'

const evaluateAction = (
	conditonal: Omit<ContextActionNameObject, 'condition'> | ContextActionNameGenerator,
	action: PartialOmit<ContextAction, 'action'>,
): ContextActionName | null => {
	if (typeof conditonal === 'function') return conditonal(action)

	if ('action' in conditonal && conditonal.action) {
		const actionGen = conditonal.action
		if (typeof actionGen === 'function') return actionGen(action)
		return actionGen
	}
	return null
}
export default evaluateAction
