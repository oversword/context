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
		if (!config.keys) return current
		return {
			...current,
			...config.keys,
		}
	}, {})

export default contextsDecideKeys
