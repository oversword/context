import { MENU_ITEM_ID, MENU_ITEM_PARENT } from '@/constants/menu-item'
import { ContextMenuItemMode } from '@/types/index.types'
import { ContextSystemConfig } from '@/types/system.types'

const defaultConfiguration: ContextSystemConfig = {
	strategy_mergeMenu: (staticMenu) => (_action, current, parentInfo) => {
		const cleanCurrent = current.filter(item => !(
			item[MENU_ITEM_PARENT] &&
			item[MENU_ITEM_ID] === parentInfo[MENU_ITEM_ID]
		))
		return [
			...staticMenu,
			...cleanCurrent,
			...(parentInfo && parentInfo.menu.length
				? [{
					mode: ContextMenuItemMode.section,
					label: parentInfo.label,
					children: parentInfo.menu,
					[MENU_ITEM_ID]: parentInfo[MENU_ITEM_ID],
					[MENU_ITEM_PARENT]: true
				}]
				: [])
		]
	},
	strategy_mergeActs: (staticActs) => (_action, current) => Object.entries(staticActs).reduce((current, [actionName, options]) => ({
		...current,
		[actionName]: {
			...(current[actionName] || {}),
			...options,
		}
	}), current),
	strategy_mergeData: (staticData) => (_action, current) => Object.assign({}, current, staticData)
}
export default defaultConfiguration