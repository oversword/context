import evaluateCondition from '@/conditions/evaluate-condition'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import { ContextAction, ContextActsGroup, ContextMenuItem, ContextMenuItemList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'


const menuFilter = (menu: ContextMenuItemList, action: PartialOmit<ContextAction, 'action'>, acts: ContextActsGroup): ContextMenuItemList => {
	return menu.filter((menuItem: ContextMenuItem): boolean => {
		if (menuItem[MENU_ITEM_ID])
			return true

		if ('action' in menuItem && menuItem.action) {
			const options = acts[menuItem.action]
			if (!evaluateCondition(options, action))
				return false
		}
		return true
	}).map((menuItem: ContextMenuItem): ContextMenuItem => {
		if (menuItem[MENU_ITEM_ID])
			return menuItem
		if (!('mode' in menuItem))
			return menuItem

		return {
			...menuItem,
			children: menuFilter(menuItem.children, action, acts)
		}
	})
}
export default menuFilter