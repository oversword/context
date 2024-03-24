// import selectorMatch from '@/selector'
import { ContextAction, ContextKeyListGroup, StoreMetaList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'

/**
 * 
 * @param contexts 
 * @param _action 
 * @returns 
 */
const contextsDecideKeys = (
	contexts: StoreMetaList,
	_action: PartialOmit<ContextAction, 'action'>,
): ContextKeyListGroup =>
	contexts.reduce((current: ContextKeyListGroup, { config }) => {
		const { keys } = config
		if (!keys) return current

		// const matchingKeys = Object.entries(keys).filter(selectorMatch(action.path))

		// matchingKeys.reduce((current, [,keysConfig]) => {

		// }, current)
		return {
			...current,
			...keys,
		}
	}, {})

export default contextsDecideKeys
