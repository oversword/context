import partition from '../../array/iterators/partition'
import { EnvironmentApi } from '../types/environment.types'
import closeAll from './close-all'

const closeLevel = (environment: EnvironmentApi, level: number): void => {
	if (!environment.exists())
		throw new Error('Could not close menus because the environment does not exist.')

	// Decide which menus to remove and keep based on the level we're closing to
	const [keep, remove] = partition(environment.menus, menu => menu.level > level)

	// If there are none to remove, do nothing
	if (remove.length === 0) return

	// If there are none to keep, destroy everything
	if (keep.length === 0) {
		closeAll(environment)
		return
	}

	// If we keep some and remove others
	// Remove each menu marked for removal
	remove.forEach(menu => {
		menu.reactRoot.unmount()
		menu.container.remove()
	})

	// Only keep menus marked for keeping
	environment.menus = keep

	// Re-focus the next highest level menu
	const currentMenu = keep.find(menu => menu.level === level)
	if (currentMenu) (currentMenu.container.childNodes[0] as HTMLElement).focus()
}
export default closeLevel
