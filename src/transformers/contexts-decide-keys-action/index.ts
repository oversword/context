import {
	ContextAction,
	ContextActionName,
	StoreMetaList,
	ContextKeyList,
	ContextAct,
} from '@/types/index.types'
import shallowMatch from '@/generic/array/conditions/shallow-match'
import contextsDecideActs from '@/transformers/contexts-decide-acts'
import splitCombination from '@/generic/string/transformers/split-combination'
import PartialOmit from '@/types/partial-omit'
import { inactiveLog as log } from '@/side-effects/debug-log'
import evaluateCondition from '@/conditions/evaluate-condition'


type ActCombination = { combination: ContextKeyList; actionName: ContextActionName }
const getActCombinations = ([actionName, actDefinition]: [ContextActionName, ContextAct]): Array<ActCombination> => {
	if (!actDefinition.keys) return []
	return actDefinition.keys.map((key): ActCombination => ({
		combination: splitCombination(key),
		actionName
	}))
}
const sort_longestCombinationFirst = (a: ActCombination, b: ActCombination): number => b.combination.length - a.combination.length

const find_combination = (searchCombination: ContextKeyList) =>
	({ combination }: ActCombination): boolean =>
		shallowMatch(combination, searchCombination)

/**
 * Find an action in the contexts that is triggered by a
 * key combination matching the key combination that initiated the action
 * 
 * @param contexts List of StoreMeta Contexts
 * @param action The current action data
 * @returns ContextActionName (if matched) OR null (if not matched)
 */
const contextsDecideKeysAction = (
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
): ContextActionName | null => {
	const acts = contextsDecideActs(contexts, action)
	log('contextsDecideKeysAction', {acts})
	const actsEntries = Object.entries(acts)
	const possibleActs = actsEntries.filter(([,actDefinition]) => evaluateCondition(actDefinition, action))
	
	const actCombinations = (
		[] as Array<ActCombination>
	).concat(
		...possibleActs.map(getActCombinations)
	).sort(sort_longestCombinationFirst)
	if (!actCombinations.length) return null

	const { event } = action
	if (!(event && 'combination' in event)) return null
	
	const matchedCombination = actCombinations.find(find_combination(event.combination))
	if (!matchedCombination) return null
	
	return matchedCombination.actionName
}
export default contextsDecideKeysAction
