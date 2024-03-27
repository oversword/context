import evaluateDisabled from '@/conditions/evaluate-disabled'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import { ContextAction, ContextActsGroup, ContextMenuItem, ContextMenuItemList, ContextActMenuItem, ContextActMenuItemList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'

/**
 * Apply the given properties to each item of the given menu - 
 *  unless the menu item already has the `MENU_ITEM_ID` flag,
 *  which indicates the process has already been done previously
 * 
 * @param menu The menu to apply data to
 * @param additionalProperties The data to apply to each menu item
 * 
 * @returns The given menu, with additionalProperties applied to each item
 */
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

/**
 * Merges menu items with the act definitions they relate to,
 *  copying over certain properties for rendering purposes
 * 
 * @param menu The menu to apply the act data to
 * @param action The current data available for the action
 * @param acts The acts to source the data from
 * 
 * @returns The given menu, with `disbaled` flags and `keys` lists derived from the given acts
 */
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