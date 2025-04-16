/**
 * @jest-environment jsdom
 */
global.IS_REACT_ACT_ENVIRONMENT = true

import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import React from 'react'
import { Root, createRoot } from 'react-dom/client'
import { fireEvent } from '@testing-library/react'

import Context from './Context'
import DataContext from './DataContext'
import SystemContext from '@/constants/system-context'
import CONTEXT_CLASS from '@/constants/context-class'
import ROOT_ID from '@/constants/root-id'
import initialiseContextSystem from '@/system/initialise'
import menuItemClasses from '@/components/ContextMenuItem/classes'
import { ContextConfig, ContextInterceptGroup } from '@/types/index.types'

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
	React.act(() => {
		reactRoot.unmount()
		container.remove()
	})
})
jest.spyOn(console, 'error')
describe('Context Component', () => {
	describe('A ContextSystem must be provided', () => {
		test('Throws as error if a context system is not provided', () => {
			expect(() => {
				React.act(() => {
					reactRoot.render(
						<Context></Context>
					)
				})
			}).toThrowError()
		})
		test('Does not throw an error if context system is provided', () => {
			expect(() => {
				React.act(() => {
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
			React.act(() => {
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
			const context: ContextConfig = {
				type: 'test-type',
				acts: {
					'test-act': {}
				},
				menu: [
					{label:'Item Label',action:'test-act'}
				]
			}
			React.act(() => {
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
			const context: ContextConfig = {
				type: 'test-type',
				acts: {
					'test-act': {}
				},
				menu: [
					{label:'Item Label',action:'test-act'}
				]
			}
			const mockIntercept = jest.fn<() => void>().mockReturnValue(undefined)
			const intercept: ContextInterceptGroup = {
				'test-type.test-act': mockIntercept
			}
			React.act(() => {
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

			React.act(() => {
				fireEvent.contextMenu(testDiv)
			})
			const menuItem = container.querySelector(`.${menuItemClasses.ContextMenuItem}`)
			expect(menuItem).toBeInstanceOf(HTMLElement)
			if (!menuItem) { return }

			await React.act(async () => {
				fireEvent.focus(menuItem)
				fireEvent.click(menuItem)
				await timeout()
			})

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
			const context: ContextConfig = {
				type: 'test-type',
				acts: {
					'test-act': {
						keys: ['Click']
					}
				},
				menu: [
					{label:'Item Label',action:'test-act'}
				]
			}
			const mockIntercept = jest.fn<() => void>().mockReturnValue(undefined)
			const intercept: ContextInterceptGroup = {
				'test-type.test-act': mockIntercept
			}
			React.act(() => {
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
			const context: ContextConfig = {
				type: 'test-type',
				acts: {
					'test-act': {}
				},
			}
			const mockIntercept = jest.fn<() => void>().mockReturnValue(undefined)
			const intercept: ContextInterceptGroup = {
				'test-type.test-act': mockIntercept,
				'child-type.child-act': 'test-act'
			}
			const childContext: ContextConfig = {
				type: 'child-type',
				acts: {
					'child-act': {
						keys: ['Click']
					}
				}
			}
			React.act(() => {
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
