import {
	ContextAction,
	ContextActionName,
	StoreMetaList,
	ContextKeyList,
} from '../../types/index.types'
import shallowMatch from '../../generic/array/conditions/shallow-match'
import keysApplyConditions from '../keys-apply-conditions'
import contextsDecideActs from '../contexts-decide-acts'
import contextsDecideKeys from '../contexts-decide-keys'
import splitCombination from '../../generic/string/transformers/split-combination'
import PartialOmit from '../../types/partial-omit'
import { inactiveLog as log } from '../../side-effects/debug-log'

/**
 * 
 * @param contexts 
 * @param action 
 * @returns 
 */
const contextsDecideKeysAction = (
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
): ContextActionName | null => {
	const acts = contextsDecideActs(contexts, action)
	const keys = contextsDecideKeys(contexts, action)

	const filteredKeys = keysApplyConditions(keys, acts, action)
	const hasKeyBinds = Object.keys(filteredKeys).length !== 0

	log({ acts, keys, action, filteredKeys, hasKeyBinds })
	if (hasKeyBinds) {
		const { event } = action
		if (event && 'combination' in event) {
			const transposedKeys = (
        [] as Array<{ combination: ContextKeyList; action: ContextActionName }>
			).concat(
				...Object.entries(filteredKeys).map(
					([action, keys]): Array<{ combination: ContextKeyList; action: ContextActionName }> =>
						keys.map((key: string): { combination: ContextKeyList; action: ContextActionName } => ({
							combination: splitCombination(key),
							action,
						})),
				),
			)
			const matchedCombination = transposedKeys.find(({ combination }) =>
				shallowMatch(combination, event.combination),
			)
			if (matchedCombination) return matchedCombination.action
		}
	}
	return null
}
export default contextsDecideKeysAction
