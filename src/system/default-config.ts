import { ContextMenuItemMode } from '@/types/index.types'
import { ContextSystemConfig } from '@/types/system.types'

const defaultConfiguration: ContextSystemConfig = {
	strategy_mergeMenu: (staticMenu) => (_action, current, parentInfo) => [
		...staticMenu,
		...current,
		...(parentInfo && parentInfo.menu.length
			? [{
				mode: ContextMenuItemMode.section,
				label: parentInfo.label,
				children: parentInfo.menu
			}]
			: [])
	],
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