import getPath from '@/generic/object/transformers/get-path'
import { ContextActMenuItem } from '@/types/index.types'

const menuFindItem = (
	menu: ContextActMenuItem[],
	predicate: ((item: ContextActMenuItem, path: Array<string | number | symbol>, menu: ContextActMenuItem[]) => boolean),
	path: Array<string | number | symbol> = []
): ContextActMenuItem | undefined => {
	const currentMenu: Array<ContextActMenuItem> = getPath(menu, path)
	if (!currentMenu) return undefined
	for (const index in currentMenu) {
		const item = currentMenu[index]
		if (predicate(item, [ ...path, index ], menu))
			return item
		if ('children' in item) {
			const subResult = menuFindItem(menu, predicate, [...path,index,'children'])
			if (subResult) return subResult
		}
	}
	return undefined
}
export default menuFindItem