import { ContextAction, ContextCondition } from '@/types/index.types'

const evaluateCondition = <TAction extends Partial<ContextAction> = ContextAction>(
	conditonal: { condition?: ContextCondition<TAction> | boolean } | undefined | false | null,
	action: TAction,
): boolean => {
	if (!conditonal) return false
	if (conditonal.condition === false) return false
	if (typeof conditonal.condition === 'function') return Boolean(conditonal.condition(action))
	return true
}
export default evaluateCondition
