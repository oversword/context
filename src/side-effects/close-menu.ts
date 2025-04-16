import partition from '@/generic/array/iterators/partition'
import { EnvironmentApi, EnvironmentMenus } from '@/types/environment.types'

const allDescendents = (id: string, menus: EnvironmentMenus) => {
	return menus.filter(menu => id === menu.parentId)
		.flatMap(menu => [
			menu.id, ...allDescendents(menu.id, menus) 
		])
}

const closeMenu = (environment: EnvironmentApi, menu: string): void => {
	if (!environment.exists())
		throw new Error('Could not close menus because the environment does not exist.')

	const toClose = [menu,...allDescendents(menu, environment.menus)]
	// Decide which menus to remove and keep based on the level we're closing to
	const [keep, remove] = partition(environment.menus, menu => toClose.includes(menu.id))

	// If there are none to remove, do nothing
	if (remove.length === 0) return

	// If there are none to keep, destroy everything
	if (keep.length === 0) {
		// Delete all existing menus from React
		for (const menu of environment.menus)
			menu.destroy()

		// Remove event listener
		environment.root.removeEventListener('mousedown', environment.cancel)
		// Remove the root element
		environment.container?.remove()
		// Remove the environment
		environment.delete()
		return
	}

	// If we keep some and remove others
	// Remove each menu marked for removal
	for (const menu of remove)
		menu.destroy()

	// Only keep menus marked for keeping
	environment.menus = keep
}
export default closeMenu
