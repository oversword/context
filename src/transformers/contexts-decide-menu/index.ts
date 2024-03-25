import { ContextAction, ContextMenuItemList, ContextMenuItemMode, StoreMetaList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'
import selectorMatch from '@/selector'

/**
 * 
 * @param contexts 
 * @param action 
 * @returns 
 */
const contextsDecideMenu = (
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
	parentMenu: ContextMenuItemList = []
): ContextMenuItemList =>
	contexts.reduce((current: ContextMenuItemList, { config }): ContextMenuItemList => {
		const { menu } = config
		if (!menu) return current
		const matchingMenus = Object.entries(menu).filter(selectorMatch(action.path))
		return matchingMenus.reduce(
			(current: ContextMenuItemList, [,menuGen]): ContextMenuItemList => {
				if (typeof menuGen === 'function') return menuGen(action, current, parentMenu)
				if (Array.isArray(menuGen)) return [
					...menuGen,
					...current,
					...(parentMenu.length
						? [{
							mode: ContextMenuItemMode.branch,
							label: 'Parent Actions',
							children: parentMenu
						}]
						: [])
				]
				console.error(`Unknown menu type: ${typeof menuGen}`)
				return current
			},
			current,
		)
	}, [])

export default contextsDecideMenu