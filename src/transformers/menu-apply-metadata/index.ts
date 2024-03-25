import evaluateDisabled from '@/conditions/evaluate-disabled'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import { ContextAction, ContextActsGroup, ContextMenuItem, ContextMenuItemList, ContextActMenuItem, ContextActMenuItemList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'

export const actMenuApplyData = (menu: ContextActMenuItemList, additionalProperties: object): ContextActMenuItemList =>
	menu.map((menuItem) => {
		if (menuItem[MENU_ITEM_ID])
			return menuItem
		return {
			...menuItem,
			...('children' in menuItem ? { children: actMenuApplyData(menuItem.children, additionalProperties) } : {}),
			...additionalProperties,
		}
	})

const menuApplyActData = (menu: ContextMenuItemList, action: PartialOmit<ContextAction, 'action'>, acts: ContextActsGroup): ContextActMenuItemList =>
	menu.map((menuItem: ContextMenuItem): ContextActMenuItem => {
		if (menuItem[MENU_ITEM_ID])
			return menuItem as ContextActMenuItem

		const actionDefinition = ('action' in menuItem && menuItem.action && acts[menuItem.action]) ? acts[menuItem.action] : null
		const actionKeys = actionDefinition && actionDefinition.keys || []
		const disabled = Boolean(actionDefinition ? evaluateDisabled(actionDefinition, action): false)
		if ('children' in menuItem) {
			return {
				...menuItem,
				children: menuApplyActData(menuItem.children, action, acts),
				disabled,
				keys: actionKeys,
			}
		} else {
			return {
				...menuItem,
				disabled,
				keys: actionKeys,
			}
		}
	})
  
export default menuApplyActData