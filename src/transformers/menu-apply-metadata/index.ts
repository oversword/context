import evaluateDisabled from '@/conditions/evaluate-disabled'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import { ContextAction, ContextActsGroup, ContextKeyListGroup, ContextMenuItem, ContextMenuItemList, ContextMetaMenuItem, ContextMetaMenuItemList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'

export const metaMenuApplyData = (menu: ContextMetaMenuItemList, additionalProperties: object): ContextMetaMenuItemList =>
	menu.map((menuItem) => {
		if (menuItem[MENU_ITEM_ID])
			return menuItem
		return {
			...menuItem,
			...('children' in menuItem ? { children: metaMenuApplyData(menuItem.children, additionalProperties) } : {}),
			...additionalProperties,
		}
	})

const menuApplyMetaData = (menu: ContextMenuItemList, action: PartialOmit<ContextAction, 'action'>, keys: ContextKeyListGroup, acts: ContextActsGroup): ContextMetaMenuItemList =>
	menu.map((menuItem: ContextMenuItem): ContextMetaMenuItem => {
		if (menuItem[MENU_ITEM_ID])
			return menuItem as ContextMetaMenuItem

		const actionKeys = 'action' in menuItem && keys[menuItem.action] ? keys[menuItem.action] : []
		const disabled = Boolean('action' in menuItem && menuItem.action && evaluateDisabled(acts[menuItem.action], action))
		if ('children' in menuItem) {
			return {
				...menuItem,
				children: menuApplyMetaData(menuItem.children, action, keys, acts),
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
  
export default menuApplyMetaData