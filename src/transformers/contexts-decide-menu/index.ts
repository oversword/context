import { ContextAction, ContextMenuItemList, StoreMetaList } from '../../types/index.types'
import PartialOmit from '../../types/partial-omit'
import selectorMatch from '../../selector'

/**
 * 
 * @param contexts 
 * @param action 
 * @returns 
 */
const contextsDecideMenu = (
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
): ContextMenuItemList =>
	contexts.reduce((current: ContextMenuItemList, { config }): ContextMenuItemList => {
		const { menu } = config
		if (!menu) return current
		const matchingMenus = Object.entries(menu).filter(selectorMatch(action.path))
		return matchingMenus.reduce(
			(current: ContextMenuItemList, [,menuGen]): ContextMenuItemList => {
				if (typeof menuGen === 'function') return menuGen(action, current)
				if (Array.isArray(menuGen)) return [...menuGen, ...current]
				console.error(`Unknown menu type: ${typeof menuGen}`)
				return current
			},
			current,
		)
	}, [])

export default contextsDecideMenu
