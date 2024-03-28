import humanise from '@/generic/string/transformers/humanise'
import { ContextMenuItem } from '@/types/index.types'

/**
 * Extracts the most unique idetifier available for a the ContextMenuItem `menuItem`
 *
 * @param menuItem
 * @returns A pseud-unique key
 */
export const getKey = (menuItem: ContextMenuItem): string =>
	menuItem.key ||
	menuItem.id ||
	menuItem.label ||
	menuItem.title ||
	('action' in menuItem && menuItem.action) ||
	String(menuItem)

/**
 * Extracts the most human readable identifier avilable for a the ContextMenuItem `menuItem`
 *
 * @param menuItem
 * @returns A human-readable label
 */
export const getLabel = (menuItem: ContextMenuItem): string =>
	menuItem.label || menuItem.title || ('action' in menuItem && menuItem.action && humanise(menuItem.action)) || ''
