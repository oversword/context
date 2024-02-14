import { ContextAction, ContextCondition } from 'types/index.types'

const evaluateDisabled = <TAction extends Partial<ContextAction> = ContextAction>(
	conditonal: { disabled?: ContextCondition<TAction> | boolean } | undefined | false | null,
	action: TAction,
): boolean => {
	if (!conditonal) return false
	if (!conditonal.disabled) return false
	if (conditonal.disabled === true) return true
	return Boolean(conditonal.disabled(action))
}
export default evaluateDisabled
