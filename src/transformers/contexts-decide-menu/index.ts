import { ContextAction, ContextConfig, ContextMenuItemList, ContextMenuListGenerator, ContextParentMenuMeta, ContextSelector, StoreMetaList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'
import selectorMatch from '@/selector'
import storeMetaHasType from '../store-meta-has-type'
import { ContextSystemConfig } from '@/types/system.types'

/**
 * 
 * @param contexts 
 * @param action 
 * @returns 
 */
const contextsDecideMenu = (
	configuration: Pick<ContextSystemConfig, 'strategy_mergeMenu'>,
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
	parentInfo: ContextParentMenuMeta | null = null
): ContextMenuItemList =>
	contexts.reduce((current: ContextMenuItemList, { config }, index, list): ContextMenuItemList => {
		const selfConfig = config && (index === 0 || index < 1 + list.slice(1).findIndex(storeMetaHasType))
		const { overrides } = config
		if (!(selfConfig || overrides)) return current

		const selfMenu: Array<[ContextSelector,ContextConfig]> = selfConfig
			? [['self',config]]
			: []
		const matchingOverrides = Object.entries(overrides || {}).filter(selectorMatch(action.path))
		
		return selfMenu.concat(matchingOverrides).reduce(
			(current: ContextMenuItemList, [,config]): ContextMenuItemList => {
				if (!(config && config.menu)) return current
				let menuGen: ContextMenuListGenerator
				if (typeof config.menu === 'function')
					menuGen = config.menu
				else if (Array.isArray(config.menu))
					menuGen = configuration.strategy_mergeMenu(config.menu)

				if (menuGen)
					return menuGen(action, current, parentInfo)
				console.error(`Unknown menu type: ${typeof config.menu}`)
				return current
			},
			current,
		)
	}, [])

export default contextsDecideMenu