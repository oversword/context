import { ContextActionName, ContextMenuItemFilled } from '../../types/index.types'

/**
 * Converts a dash (-), or underscore (_) separated, lowercase string
 * into a space separated, capitalised string.
 *
 * e.g. "this-action_name" => "This Action Name"
 *
 * @param action The machine name of a context action
 * @returns The human version of the name
 */
const humaniseAction = (action: ContextActionName): string =>
	action
		.split(/[_-]+/g)
		.map(s => s[0].toUpperCase() + s.slice(1))
		.join(' ')

/**
 * Extracts the most unique idetifier available for a the ContextMenuItem `menuItem`
 *
 * @param menuItem
 * @returns A pseud-unique key
 */
export const getKey = (menuItem: ContextMenuItemFilled): string =>
	menuItem.key ||
  menuItem.id ||
  menuItem.label ||
  menuItem.title ||
  menuItem.action ||
  String(menuItem)

/**
 * Extracts the most human readable identifier avilable for a the ContextMenuItem `menuItem`
 *
 * @param menuItem
 * @returns A human-readable label
 */
export const getLabel = (menuItem: ContextMenuItemFilled): string =>
	menuItem.label || menuItem.title || (menuItem.action && humaniseAction(menuItem.action)) || ''
