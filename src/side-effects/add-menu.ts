import React from 'react'
import { createRoot } from 'react-dom/client'
import {
	ContextSystemApi,
	ContextMenuOptions,
	ContextMenuOptionsBounds,
	ContextMenuOptionsPosition,
	ContextMenuOptionsSize,
	ContextMenuResult,
} from '@/types/system.types'
import ContextMenu from '@/components/ContextMenu'
import { ContextData, ContextId, ContextInterceptGroup } from '@/types/index.types'
import closeLevel from '@/side-effects/close-level'
import MENU_CLASS from '@/constants/menu-class'
import ROOT_ID from '@/constants/root-id'
import SystemContext from '@/constants/system-context'
import { EnvironmentApi } from '@/types/environment.types'
import closeAll from './close-all'

/**
 * Positions a box of size `box` within `withinBox`, around the point `position`
 *
 * If position is given a width `w` and/or height `h`,
 * then it will be positioned as close to one of
 * the four corners of that box as it can.
 *
 * The algorithm will prioritise the relative positions:
 * 1. Bottom
 * 2. Top
 *
 * 1. Right
 * 2. Left
 *
 * Therefore the default position will be as close to
 * the Bottom Right corner of the `position` argument as possible,
 * and it will be this way unless there is a lot of room in the Top/Left
 * while there is no room in the Bottom/Right
 *
 * @param position
 * @param box
 * @param withinBox
 * @returns
 */
const boundBox = (
	position: ContextMenuOptionsPosition,
	box: ContextMenuOptionsSize,
	withinBox: ContextMenuOptionsBounds,
): ContextMenuOptionsPosition => {
	const possiblePositions = [
		// 00: Top Left
		{
			x: position.x - box.w,
			y: position.y + (position.h || 0) - box.h,
		},
		// 01: Top Right
		{
			x: position.x + (position.w || 0),
			y: position.y + (position.h || 0) - box.h,
		},
		// 10: Bottom Left
		{
			x: position.x - box.w,
			y: position.y,
		},
		// 11: Bottom Right
		{
			x: position.x + (position.w || 0),
			y: position.y,
		},
	]

	// Go to the right if it CAN fit on the right, or if it CAN'T fit on the left
	const leftRight = withinBox.w - (position.x + (position.w || 0)) > box.w || position.x < box.w
	// Go to the bottom if it CAN fit on the bottom, or if it CAN'T fit on the top
	const topBottom = withinBox.h - (position.y + (position.h || 0)) > box.h || position.y < box.h

	// Interpret those conditions as binary
	const positionIndex = Number(topBottom) * 2 + Number(leftRight)

	// Interpret that binary as a list index
	const chosenPosition = possiblePositions[positionIndex]

	// Limit the values to bounding box
	return {
		x: Math.max(withinBox.x, Math.min(chosenPosition.x, withinBox.w - box.w)),
		y: Math.max(withinBox.y, Math.min(chosenPosition.y, withinBox.h - box.h)),
	}
}

const addMenu = (
	contextSystemApi: ContextSystemApi,
	environment: EnvironmentApi,
	{ pos, menu, level = 0 }: ContextMenuOptions,
): Promise<ContextMenuResult | null> => {
	if (!environment.exists()) {
		const globalContainer = document.createElement('div')
		globalContainer.id = ROOT_ID
		environment.root.appendChild(globalContainer)
		environment.root.addEventListener('mousedown', environment.cancel)
		environment.create(globalContainer)
	}

	// Create a new root element for this menu to be rendered into and positioned by
	const menuContainer = document.createElement('div')
	menuContainer.classList.add(MENU_CLASS)
	environment.container?.appendChild(menuContainer)

	// Record the menu level on the element itself for reference in the cancel action
	menuContainer.dataset.level = String(level)

	// Position the menu off of the screen
	menuContainer.style.position = 'absolute'
	menuContainer.style.top = '-1000px'
	menuContainer.style.left = '-1000px'

	let positioned = false
	const positionMenu = (): void => {
		// Position menu once it has rendered

		if (positioned) return
		positioned = true

		const bounds = menuContainer.getBoundingClientRect()
		const position = boundBox(
			pos,
			{
				w: bounds.width,
				h: bounds.height,
			},
			{
				x: 0,
				y: 0,
				w: window.innerWidth,
				h: window.innerHeight,
			},
		)

		menuContainer.style.top = `${position.y}px`
		menuContainer.style.left = `${position.x}px`
	}

	return new Promise<ContextMenuResult | null>(resolve => {
		const intercept: ContextInterceptGroup = {
			'context-menu.action': action => {
				// Close Everything if complete
				if (level === 0) {
					closeAll(environment)
				}
				// Resolve with data
				resolve({
					id: action.data.ContextMenu_id as ContextId,
					action: action.data.ContextMenu_action as string,
					data: action.data.ContextMenu_data as ContextData,
				})
			},
			'context-menu.load': positionMenu,
			'context-menu.close': () => {
				// Close this menu (and its descedants)
				closeLevel(environment, level - 1)
				resolve(null)
			},
		}

		const reactEl = React.createElement(
			SystemContext.Provider,
			{
				value: contextSystemApi,
			},
			React.createElement(ContextMenu, {
				menu,
				intercept,
			}),
		)

		const reactRoot = createRoot(menuContainer)
		reactRoot.render(reactEl)

		// Add the menu to the environment
		environment.menus = [
			...environment.menus,
			{
				reactRoot,
				level,
				container: menuContainer,
			},
		]
	})
}
export default addMenu
