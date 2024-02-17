import {
	ContextAction,
	ContextMenuItemFilled,
	ContextMenuItemListFilled,
	ContextKeyListGroup,
} from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'

/**
 * Attaches related key bindings to menu items recursively
 * 
 * @param menu The menu to be filled with keys
 * @param keys The keys to fill in the menu with, indexed by ContextActionName
 * 
 * @param action contextual info for generative execution (TODO: unused??)
 * 
 * @returns filled menu items
 */
const menuApplyKeys = (
	menu: ContextMenuItemListFilled,
	keys: ContextKeyListGroup,
	action: PartialOmit<ContextAction, 'action'>,
): ContextMenuItemListFilled =>
	menu.map(
		(menuItem: ContextMenuItemFilled): ContextMenuItemFilled => ({
			...(menuItem.action && keys[menuItem.action] ? { keys: keys[menuItem.action] } : {}),
			...menuItem,
			...(menuItem.children ? { children: menuApplyKeys(menuItem.children, keys, action) } : {}),
		}),
	)

export default menuApplyKeys
