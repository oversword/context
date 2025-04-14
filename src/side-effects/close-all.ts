import { EnvironmentApi } from '@/types/environment.types'

const closeAll = (environment: EnvironmentApi, shouldReject: boolean): void => {
	if (!environment.exists())
		throw new Error('Could not close menus because the environment does not exist')

	// Delete all existing menus from React
	// environment.menus.forEach(menu => {
	for (const menu of environment.menus)
		menu.destroy(shouldReject)

	// Remove event listener
	environment.root.removeEventListener('mousedown', environment.cancel)

	// Remove the root element
	environment.container?.remove()

	// Remove the environment
	environment.delete()
}
export default closeAll
