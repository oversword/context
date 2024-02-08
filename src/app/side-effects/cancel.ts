import MENU_CLASS from '../constants/menu-class'
import ROOT_ID from '../constants/root-id'
import { EnvironmentApi } from '../types/environment.types'
import closeAll from './close-all'
import closeLevel from './close-level'

const cancel = (environment: EnvironmentApi, event: Event): void => {
	if (!environment.exists())
		throw new Error('Could not close menu because the environment does not exist')

	// If a menu has been focussed, close every descendant menu
	const menuEl = (event.target as HTMLElement)?.closest<HTMLElement>(`.${MENU_CLASS}`)
	if (menuEl) {
		const level = Number(menuEl.dataset.level)
		closeLevel(environment, level)
		return
	}

	// If the root element has been focussed, close all menus
	const rootEl = (event.target as HTMLElement)?.closest(`#${ROOT_ID}`)
	if (rootEl && rootEl === environment.container) return
	closeAll(environment)
}

export default cancel
