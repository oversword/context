import {
	ContextAction,
	ContextMenuItemFilled,
	ContextMenuItemListFilled,
	ContextActsGroup,
} from 'types/index.types'
import filterTruthy from 'generic/array/iterators/filter-truthy'
import PartialOmit from 'types/partial-omit'
import evaluateCondition from 'conditions/evaluate-condition'
import evaluateDisabled from 'conditions/evaluate-disabled'
/**
 * Filter menus so that only those with allowed actions exist
 * The action condition will be evaluated, if false the item will be removed
 * The disabled condition will be evaluated, if true the item will be kept and marked disabled
 * 
 * @param menu 
 * @param acts 
 * @param action 
 * @returns menu, filtered recursilvely
 */
const menuApplyConditions = (
	menu: ContextMenuItemListFilled,
	acts: ContextActsGroup,
	action: PartialOmit<ContextAction, 'action'>,
): ContextMenuItemListFilled =>
	menu
		.map((menuItem: ContextMenuItemFilled): false | ContextMenuItemFilled => {
			const ret: ContextMenuItemFilled = { ...menuItem }
			if ('action' in menuItem && menuItem.action) {
				const options = acts[menuItem.action]
				if (!evaluateCondition(options, action)) return false
				if (evaluateDisabled(options, action)) ret.disabled = true
			}
			if ('children' in menuItem && menuItem.children) {
				ret.children = menuApplyConditions(menuItem.children, acts, action)
			}
			return ret
		})
		.filter(filterTruthy) as ContextMenuItemListFilled

export default menuApplyConditions
