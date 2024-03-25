/**
 * @jest-environment jsdom
 */
global.IS_REACT_ACT_ENVIRONMENT = true
// import prettify from 'beautify'

import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import React from 'react'
import { Root, createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/react'

import Context from './Context'
import DataContext from './DataContext'
import SystemContext from '@/constants/system-context'
import initialiseContextSystem from '@/system/initialise'
import { ContextConfig, ContextMenuItemMode } from '..'
// import { ContextInterceptGroup } from '@/types/index.types'

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
describe('Context Component', () => {
	// test('Actions can be triggered by another context forwarding an action', async () => {
	//   const contextSystem = initialiseContextSystem(container)
	//   const context = {
	//     type: 'test-type',
	//     acts: {
	//       'test-type': {
	//         'test-act': {}
	//       }
	//     },
	//   }
	//   const mockIntercept = jest.fn<() => void>().mockReturnValue(undefined)
	//   const intercept: ContextInterceptGroup = {
	//     'test-type.test-act': mockIntercept,
	//     'child-type.child-act': 'test-act'
	//   }
	//   const childContext = {
	//     type: 'child-type',
	//     acts: {
	//       'child-type': {
	//         'child-act': {}
	//       }
	//     },
	//     keys: {
	//       'child-act': ['Click']
	//     }
	//   }
	//   act(() => {
	//     reactRoot.render(
	//       <SystemContext.Provider value={contextSystem}>
	//         <DataContext context={context} intercept={intercept} >
	//           <Context context={childContext} >
	//             <div className="test-div">
	//               Test
	//             </div>
	//           </Context>
	//         </DataContext>
	//       </SystemContext.Provider>
	//     )
	//   })

	//   const testDiv = container.querySelector('.test-div')
	//   expect(testDiv).toBeInstanceOf(HTMLElement)
	//   if (!testDiv) { return }
	//   expect(testDiv.parentElement).toBeInstanceOf(HTMLElement)
	//   if (!testDiv.parentElement) { return }

	//   fireEvent.focus(testDiv.parentElement)
	//   fireEvent.click(testDiv)
	//   await timeout()

	//   expect(mockIntercept).toHaveBeenCalledTimes(1)
	//   expect(mockIntercept).toHaveBeenCalledWith({
	//     data: {},
	//     action: 'test-act',
	//     type: 'test-type',
	//     path: ['test-type'],
	//     event: expect.objectContaining({
	//       'char': '',
	//       'combination': [
	//         'Click',
	//       ],
	//       'pos': 'MouseClick',
	//       'symbol': 'Click',
	//       target: testDiv
	//     })
	//   })
	// })

	test('Inheritance from parent', async () => {
		const contextSystem = initialiseContextSystem(container)
		const context: ContextConfig = {
			type: 'test-type',
			menu: [
				{ label: 'Parent Action', action: 'test-act'}
			],
			acts: {
				'test-act': {}
			},
		}
		const childContext: ContextConfig = {
			type: 'child-type',
			menu: (_action, current, parent) => [
				...current,
				{ label: 'Child Action', action: 'child-act' },
				{
					label: 'Parent Actions', mode: ContextMenuItemMode.section,
					children: parent.menu
				}
			],
			acts: {
				'child-act': {
					keys: ['Click']
				}
			},
		}
		const parentAction = jest.fn()
		const childAction = jest.fn()
		act(() => {
			reactRoot.render(
				<SystemContext.Provider value={contextSystem}>
					<Context context={context} intercept={{
						'test-type.test-act': parentAction
					}} data={{ parent_key: 'test' }}>
						<DataContext context={{}}>
							<div className="parent-div">
								Outside
							</div>
							<Context context={childContext} intercept={{
								'child-type.child-act': childAction
							}} data={{ child_key: 'test' }}>
								<div className="test-div">
									Test
								</div>
							</Context>
						</DataContext>
					</Context>
				</SystemContext.Provider>
			)
		})

		const testDiv = container.querySelector('.test-div')
		expect(testDiv).toBeInstanceOf(HTMLElement)
		if (!testDiv) { return }

		fireEvent.contextMenu(testDiv)
		const parentItem = container.querySelectorAll('.ContextMenuItem-ContextMenuItem')[1]
		fireEvent.focus(parentItem)
		fireEvent.click(parentItem)
		await timeout()
		expect(parentAction).toHaveBeenCalledTimes(1)
		expect(parentAction).toHaveBeenCalledWith(expect.objectContaining({ action: 'test-act', data: { parent_key: 'test' }, type: 'test-type', path: ['test-type'] }))

		fireEvent.contextMenu(testDiv)
		const childItem = container.querySelectorAll('.ContextMenuItem-ContextMenuItem')[0]
		fireEvent.focus(childItem)
		fireEvent.click(childItem)
		await timeout()
		expect(childAction).toHaveBeenCalledTimes(1)
		expect(childAction).toHaveBeenCalledWith(expect.objectContaining({ action: 'child-act', data: { parent_key: 'test', child_key: 'test' }, type: 'child-type', path: ['test-type', 'child-type'] }))
	})
})
