
// TODO: test and jsdoc
// TODO: reimplement menuApplyKeys(menuApplyConditions

import { MENU_ITEM_DATA } from '@/constants/menu-item'
import contextsDecideActs from '@/transformers/contexts-decide-acts'
import contextsDecideData from '@/transformers/contexts-decide-data'
import contextsDecideKeys from '@/transformers/contexts-decide-keys'
import contextsDecideMenu from '@/transformers/contexts-decide-menu'
import contextsExtractPath from '@/transformers/contexts-extract-path'
import contextsExtractType from '@/transformers/contexts-extract-type'
import menuFilter from '@/transformers/menu-filter'
import menuApplyMetaData, {metaMenuApplyData} from '@/transformers/menu-apply-metadata'
import { ContextEvent, ContextMetaMenuItemList, StoreMetaList } from '@/types/index.types'

/**
 * 
 * @param contexts 
 * @param event 
 * @param parentMenu 
 * @returns 
 */
const contextsDecideMetaMenu = (contexts: StoreMetaList, event: ContextEvent, parentMenu: ContextMetaMenuItemList): ContextMetaMenuItemList => {
	const type = contextsExtractType(contexts)
	const path = contextsExtractPath(contexts)
	const data = contextsDecideData(contexts, { path, type, event })
	const menu = contextsDecideMenu(contexts, { path, type, data, event }, parentMenu)

	const keys = contextsDecideKeys(contexts, { path, type, data, event })
	const acts = contextsDecideActs(contexts, { path, type, data, event })

	const filteredMenu = menuFilter(menu,
		{ path, type, data, event },
		acts,
	)
	const metaMenu = menuApplyMetaData(
		filteredMenu,
		{ path, type, data, event },
		keys,
		acts,
	)
	const finalMenu = metaMenuApplyData(
		metaMenu,
		{
			[MENU_ITEM_DATA]: data,
		}
	)
	return finalMenu
}
export default contextsDecideMetaMenu
