import evaluateDisabled from '@/conditions/evaluate-disabled'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import { ContextAction, ContextActsGroup, ContextMenuItem, ContextMenuItemList, ContextActMenuItem, ContextActMenuItemList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'
import humanise from '@/generic/string/transformers/humanise'
import { evaluateString } from '@/conditions/evaluate-string'

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
	menu.map((menuItem: ContextMenuItem, index): ContextActMenuItem => {
		if (menuItem[MENU_ITEM_ID])
			return menuItem as ContextActMenuItem
		const actionName = evaluateString((('action' in menuItem) && menuItem.action) || undefined)(action)
		const fullAction: ContextAction = {
			...action,
			action: actionName
		}
		const actionDefinition = (actionName && acts[actionName]) ? acts[actionName] : null
		const actionKeys = actionDefinition && actionDefinition.keys || []
		const disabled = Boolean(actionDefinition ? evaluateDisabled(actionDefinition, fullAction): false)
		const label = evaluateString(menuItem.label, menuItem.title, () => actionName && humanise(actionName))(fullAction) || ''
		const id = evaluateString(menuItem.key, menuItem.id, menuItem.label, menuItem.title, actionName, String(menuItem)+index)(fullAction)
		const newObj = {
			...menuItem,
			action: actionName,
			id,
			label,
			disabled,
			keys: actionKeys,
		} as ContextActMenuItem
		if ('children' in menuItem) {
			return {
				...newObj,
				children: menuApplyActData(menuItem.children, action, acts),
			}
		} else {
			return newObj
		}
	})
  
export default menuApplyActData