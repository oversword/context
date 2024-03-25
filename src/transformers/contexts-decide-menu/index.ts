import { ContextAction, ContextConfig, ContextMenuItemList, ContextMenuItemMode, ContextParentMenuMeta, ContextSelector, StoreMetaList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'
import selectorMatch from '@/selector'
import storeMetaHasType from '../store-meta-has-type'

/**
 * 
 * @param contexts 
 * @param action 
 * @returns 
 */
const contextsDecideMenu = (
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
	parentInfo: ContextParentMenuMeta | null = null
): ContextMenuItemList =>
	contexts.reduce((current: ContextMenuItemList, { config }, index, list): ContextMenuItemList => {
		const selfConfig = config && (index === 0 || index < 1 + list.slice(1).findIndex(storeMetaHasType))
		const { overrides } = config
		if (!(selfConfig || overrides)) return current

		const selfMenu: Array<[ContextSelector,ContextConfig]> = selfConfig && config
			? [['self',config]]
			: []
		const matchingOverrides = Object.entries(overrides || {}).filter(selectorMatch(action.path))
		
		return selfMenu.concat(matchingOverrides).reduce(
			(current: ContextMenuItemList, [,config]): ContextMenuItemList => {
				if (!(config && config.menu)) return current
				if (typeof config.menu === 'function') return config.menu(action, current, parentInfo)
				if (Array.isArray(config.menu)) return [
					...config.menu,
					...current,
					...(parentInfo && parentInfo.menu.length
						? [{
							mode: ContextMenuItemMode.section,
							label: parentInfo.label,
							children: parentInfo.menu
						}]
						: [])
				]
				console.error(`Unknown menu type: ${typeof config.menu}`)
				return current
			},
			current,
		)
	}, [])

export default contextsDecideMenu