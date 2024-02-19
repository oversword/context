/**
 * @jest-environment jsdom
 */
global.IS_REACT_ACT_ENVIRONMENT = true

import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import React from 'react'
import { Root, createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/react'

import Context from './Context'
import DataContext from './DataContext'
import SystemContext from '@/constants/system-context'
import CONTEXT_CLASS from '@/constants/context-class'
import ROOT_ID from '@/constants/root-id'
import initialiseContextSystem from '@/system/initialise'
import menuItemClasses from '@/components/ContextMenuItem/classes'
import { ContextInterceptGroup } from '@/types/index.types'

const timeout = (n = 0) => new Promise<void>((resolve) => {
	setTimeout(resolve, n)
})

let container: HTMLElement
let reactRoot: Root
beforeEach(() => {
	container = document.createElement('div')
	document.body.appendChild(container)
	reactRoot = createRoot(container)
})

afterEach(() => {
	act(() => {
		reactRoot.unmount()
		container.remove()
	})
})
jest.spyOn(console, 'error')
describe('Context Component', () => {
	describe('A ContextSystem must be provided', () => {
		test('Throws as error if a context system is not provided', () => {
			expect(() => {
				act(() => {
					reactRoot.render(
						<Context></Context>
					)
				})
			}).toThrowError()
		})
		test('Does not throw an error if context system is provided', () => {
			expect(() => {
				act(() => {
					const contextSystem = initialiseContextSystem(container)
					reactRoot.render(
						<SystemContext.Provider value={contextSystem}>
							<Context></Context>
						</SystemContext.Provider>
					)
				})
			}).not.toThrowError()
		})
	})
	describe('Element display', () => {
		test('Adds no extra text content to an element', () => {
			act(() => {
				const contextSystem = initialiseContextSystem(container)
				reactRoot.render(
					<SystemContext.Provider value={contextSystem}>
						<Context>
							<div className="test-div">
								Test
							</div>
						</Context>
					</SystemContext.Provider>
				)
			})
			const testDiv = container.querySelector('.test-div')
			expect(testDiv?.closest(`.${CONTEXT_CLASS}`)).toBeInstanceOf(HTMLElement)
			expect(container.textContent).toBe('Test')
			expect(container.children.length).toBe(1)
		})
		test('Displays a menu when using the onContextMenu on a wrapped item', () => {
			const contextSystem = initialiseContextSystem(container)
			const context = {
				type: 'test-type',
				acts: {
					'test-type': {
						'test-act': {}
					}
				},
				menu: {
					'test-type': [
						{label:'Item Label',action:'test-act'}
					]
				}
			}
			act(() => {
				reactRoot.render(
					<SystemContext.Provider value={contextSystem}>
						<Context context={context} >
							<div className="test-div">
								Test
							</div>
						</Context>
					</SystemContext.Provider>
				)
			})
			const testDiv = container.querySelector('.test-div')
			expect(testDiv).toBeInstanceOf(HTMLElement)
			if (!testDiv) { return }

			fireEvent.contextMenu(testDiv)
			expect(container.children.length).toBe(2)
			expect(container.querySelector(`#${ROOT_ID}`)).toBeInstanceOf(HTMLElement)
			const menuItems = container.querySelectorAll(`.${menuItemClasses.ContextMenuItem}`)
			expect(menuItems.length).toBe(1)
			expect(menuItems[0].textContent).toBe('Item Label')
		})
		test('Actions can be triggered from the menu by clicking the items', async () => {
			const contextSystem = initialiseContextSystem(container)
			const context = {
				type: 'test-type',
				acts: {
					'test-type': {
						'test-act': {}
					}
				},
				menu: {
					'test-type': [
						{label:'Item Label',action:'test-act'}
					]
				}
			}
			const mockIntercept = jest.fn<() => void>().mockReturnValue(undefined)
			const intercept: ContextInterceptGroup = {
				'test-type.test-act': mockIntercept
			}
			act(() => {
				reactRoot.render(
					<SystemContext.Provider value={contextSystem}>
						<Context context={context} intercept={intercept} >
							<div className="test-div">
								Test
							</div>
						</Context>
					</SystemContext.Provider>
				)
			})

			const testDiv = container.querySelector('.test-div')
			expect(testDiv).toBeInstanceOf(HTMLElement)
			if (!testDiv) { return }

			fireEvent.contextMenu(testDiv)
			const menuItem = container.querySelector(`.${menuItemClasses.ContextMenuItem}`)
			expect(menuItem).toBeInstanceOf(HTMLElement)
			if (!menuItem) { return }

			fireEvent.focus(menuItem)
			fireEvent.click(menuItem)
			await timeout()

			expect(mockIntercept).toHaveBeenCalledTimes(1)
			expect(mockIntercept).toHaveBeenCalledWith({
				data: {},
				action: 'test-act',
				type: 'test-type',
				path: ['test-type'],
				event: expect.objectContaining({
					type: 'contextmenu',
					target: testDiv
				})
			})
		})
		test('Actions can be triggered by pressing the configured key', async () => {
			const contextSystem = initialiseContextSystem(container)
			const context = {
				type: 'test-type',
				acts: {
					'test-type': {
						'test-act': {}
					}
				},
				menu: {
					'test-type': [
						{label:'Item Label',action:'test-act'}
					]
				},
				keys: {
					'test-act': ['Click']
				}
			}
			const mockIntercept = jest.fn<() => void>().mockReturnValue(undefined)
			const intercept: ContextInterceptGroup = {
				'test-type.test-act': mockIntercept
			}
			act(() => {
				reactRoot.render(
					<SystemContext.Provider value={contextSystem}>
						<Context context={context} intercept={intercept} >
							<div className="test-div">
								Test
							</div>
						</Context>
					</SystemContext.Provider>
				)
			})

			const testDiv = container.querySelector('.test-div')
			expect(testDiv).toBeInstanceOf(HTMLElement)
			if (!testDiv) { return }
			expect(testDiv.parentElement).toBeInstanceOf(HTMLElement)
			if (!testDiv.parentElement) { return }

			fireEvent.focus(testDiv.parentElement)
			fireEvent.click(testDiv)
			await timeout()

			expect(mockIntercept).toHaveBeenCalledTimes(1)
			expect(mockIntercept).toHaveBeenCalledWith({
				data: {},
				action: 'test-act',
				type: 'test-type',
				path: ['test-type'],
				event: expect.objectContaining({
					'char': '',
					'combination': [
						'Click',
					],
					'pos': 'MouseClick',
					'symbol': 'Click',
					target: testDiv
				})
			})
		})
		test('Actions can be triggered by another context forwarding an action', async () => {
			const contextSystem = initialiseContextSystem(container)
			const context = {
				type: 'test-type',
				acts: {
					'test-type': {
						'test-act': {}
					}
				},
			}
			const mockIntercept = jest.fn<() => void>().mockReturnValue(undefined)
			const intercept: ContextInterceptGroup = {
				'test-type.test-act': mockIntercept,
				'child-type.child-act': 'test-act'
			}
			const childContext = {
				type: 'child-type',
				acts: {
					'child-type': {
						'child-act': {}
					}
				},
				keys: {
					'child-act': ['Click']
				}
			}
			act(() => {
				reactRoot.render(
					<SystemContext.Provider value={contextSystem}>
						<DataContext context={context} intercept={intercept} >
							<Context context={childContext} >
								<div className="test-div">
									Test
								</div>
							</Context>
						</DataContext>
					</SystemContext.Provider>
				)
			})

			const testDiv = container.querySelector('.test-div')
			expect(testDiv).toBeInstanceOf(HTMLElement)
			if (!testDiv) { return }
			expect(testDiv.parentElement).toBeInstanceOf(HTMLElement)
			if (!testDiv.parentElement) { return }

			fireEvent.focus(testDiv.parentElement)
			fireEvent.click(testDiv)
			await timeout()

			expect(mockIntercept).toHaveBeenCalledTimes(1)
			expect(mockIntercept).toHaveBeenCalledWith({
				data: {},
				action: 'test-act',
				type: 'test-type',
				path: ['test-type'],
				event: expect.objectContaining({
					'char': '',
					'combination': [
						'Click',
					],
					'pos': 'MouseClick',
					'symbol': 'Click',
					target: testDiv
				})
			})
		})
	})
})
