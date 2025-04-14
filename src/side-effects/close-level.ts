import partition from '@/generic/array/iterators/partition'
import { EnvironmentApi, EnvironmentMenus } from '@/types/environment.types'
import closeAll from '@/side-effects/close-all'

const allDescendents = (id: string, menus: EnvironmentMenus) => {
	return menus.filter(menu => id === menu.parentId)
		.flatMap(menu => [
			menu.id, ...allDescendents(menu.id, menus) 
		])
}

const closeMenu = (environment: EnvironmentApi, menu: string, shouldReject: boolean): void => {
	if (!environment.exists())
		throw new Error('Could not close menus because the environment does not exist.')

	const toClose = [menu,...allDescendents(menu, environment.menus)]
	// Decide which menus to remove and keep based on the level we're closing to
	const [keep, remove] = partition(environment.menus, menu => toClose.includes(menu.id))

	// If there are none to remove, do nothing
	if (remove.length === 0) return

	// If there are none to keep, destroy everything
	if (keep.length === 0) {
		closeAll(environment, shouldReject)
		return
	}

	// If we keep some and remove others
	// Remove each menu marked for removal
	remove.forEach(menu => {
		menu.destroy(shouldReject)
	})

	// Only keep menus marked for keeping
	environment.menus = keep

	// Re-focus the next highest level menu
	// const currentMenu = keep.find(menu => menu.level === level)
	// if (currentMenu) (currentMenu.container.childNodes[0] as HTMLElement).focus()

}
export default closeMenu
