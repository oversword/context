import MENU_CLASS from '@/constants/menu-class'
import ROOT_ID from '@/constants/root-id'
import { EnvironmentApi } from '@/types/environment.types'

const cancel = (environment: EnvironmentApi, event: Event): void => {
	if (!environment.exists())
		throw new Error('Could not close menu because the environment does not exist')

	// If Clicking on a menu, ignore
	const menuEl = (event.target as HTMLElement)?.closest<HTMLElement>(`.${MENU_CLASS}`)
	if (menuEl) {
		return
	}

	// If clicking empty space, close all menus
	const rootEl = (event.target as HTMLElement)?.closest(`#${ROOT_ID}`)
	if (rootEl && rootEl === environment.container) return
	environment.closeMenu('root')
}

export default cancel
