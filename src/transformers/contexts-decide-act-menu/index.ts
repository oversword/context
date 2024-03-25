
// TODO: test and jsdoc
import { MENU_ITEM_DATA } from '@/constants/menu-item'
import contextsDecideActs from '@/transformers/contexts-decide-acts'
import contextsDecideData from '@/transformers/contexts-decide-data'
import contextsDecideMenu from '@/transformers/contexts-decide-menu'
import contextsExtractPath from '@/transformers/contexts-extract-path'
import contextsExtractType from '@/transformers/contexts-extract-type'
import menuFilter from '@/transformers/menu-filter'
import menuApplyActData, {actMenuApplyData} from '@/transformers/menu-apply-metadata'
import { ContextEvent, ContextActMenuItemList, StoreMetaList, ContextParentMenuMeta } from '@/types/index.types'

/**
 * 
 * @param contexts 
 * @param event 
 * @param parentMenu 
 * @returns 
 */
const contextsDecideActMenu = (contexts: StoreMetaList, event: ContextEvent, parentInfo: ContextParentMenuMeta | null): ContextActMenuItemList => {
	const type = contextsExtractType(contexts)
	const path = contextsExtractPath(contexts)
	const data = contextsDecideData(contexts, { path, type, event })
	const menu = contextsDecideMenu(contexts, { path, type, data, event }, parentInfo)

	const acts = contextsDecideActs(contexts, { path, type, data, event })

	const filteredMenu = menuFilter(menu,
		{ path, type, data, event },
		acts,
	)
	const actMenu = menuApplyActData(
		filteredMenu,
		{ path, type, data, event },
		acts,
	)
	const finalMenu = actMenuApplyData(
		actMenu,
		{
			[MENU_ITEM_DATA]: data,
		}
	)
	return finalMenu
}
export default contextsDecideActMenu
