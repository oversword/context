import { ContextAction, ContextConfig, ContextMenuItemList, ContextMenuListGenerator, ContextParentMenuMeta, ContextSelector, StoreMetaList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'
import selectorMatch from '@/selector'
import storeMetaHasType from '../store-meta-has-type'
import { ContextSystemConfig } from '@/types/system.types'

/**
 * Decides the menu for a given list of StoreMetas
 * 
 * @param configuration The system configuration
 * @param contexts The contexts to extract data from
 * @param action The current data available for the action
 * @param parentInfo Information about the parent menu
 * 
 * @returns The full menu for the given action
 */
const contextsDecideMenu = (
	configuration: Pick<ContextSystemConfig, 'strategy_mergeMenu'>,
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
	parentInfo: ContextParentMenuMeta | null = null
): ContextMenuItemList => {
	const firstType = contexts.findIndex(storeMetaHasType)
	const typeAfter = firstType === -1 ? contexts.length : contexts.slice(firstType + 1).findIndex(storeMetaHasType)
	const nextType = typeAfter === -1 ? contexts.length : firstType + 1 + typeAfter
	return contexts.reduce((current: ContextMenuItemList, { config }, index): ContextMenuItemList => {
		const selfConfig = config && (index < nextType)
		const { overrides } = config
		if (!(selfConfig || overrides)) return current

		const selfMenu: Array<[ContextSelector,ContextConfig]> = selfConfig
			? [['self',config]]
			: []
		const matchingOverrides = Object.entries(overrides || {}).filter(selectorMatch(action.path))
		
		return selfMenu.concat(matchingOverrides).reduce(
			(current: ContextMenuItemList, [,config]): ContextMenuItemList => {
				if (!config || config.menu === false) return current
				let menuGen: ContextMenuListGenerator
				if (typeof config.menu === 'function')
					menuGen = config.menu
				else if (config.menu === undefined)
					menuGen = configuration.strategy_mergeMenu([])
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
}

export default contextsDecideMenu