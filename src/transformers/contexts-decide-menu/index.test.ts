import contextsDecideMenu from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction, StoreMeta } from '@/types/index.types'
import defaultConfiguration from '@/system/default-config'

const defaultStoreContext = {
	outercept: {},
	intercept: {},
	data: null,
	id: '0',
	root: true,
	parent: null,
}
describe('contextsDecideMenu', () => {
	test('returns the menu options when defined in a context', () => {
		const menuObject = [
			{action:'actionName',label:'test'}
		]
		const result = contextsDecideMenu(defaultConfiguration, [{
			...defaultStoreContext,
			config: {
				type: 'contextType',
				menu: menuObject
			},
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual(menuObject)
	})
	test('Parent overrides Child: merges and overrides menu configs when defined in both the parent and child', () => {
		const result = contextsDecideMenu(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				menu: [
					{action:'actionName',label:'test'}
				]
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				overrides: {
					contextType: {
						menu: [
							{action:'parentAction',label:'merge'}
						]
					}
				}
			},
		} as StoreMeta], {path:['parentType', 'contextType']} as ContextAction)

		expect(result).toEqual([
			{'action': 'parentAction', 'label': 'merge'},
			{'action': 'actionName', 'label': 'test'}
		])
	})
	test('merges and overrides menu configs when defined in both the parent and child, with a strict relationship that is met', () => {
		const result = contextsDecideMenu(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				menu: [
					{action:'actionName',label:'test'}
				]
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				overrides: {
					'parentType > contextType': {
						menu: [
							{action:'parentAction',label:'merge'}
						]
					}
				}
			},
		} as StoreMeta], {path:['parentType', 'contextType']} as ContextAction)

		expect(result).toEqual([
			{'action': 'parentAction', 'label': 'merge'},
			{'action': 'actionName', 'label': 'test'}
		])
	})
	test('does not merge menu configs when defined in both the parent and child, with a strict relationship that is not met', () => {
		const result = contextsDecideMenu(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '2',
			config: {
				type: 'contextType',
				menu: [
					{action:'actionName',label:'test'}
				]
			},
		} as StoreMeta, {
			...defaultStoreContext,
			id: '2',
			root: false,
			parent: '0',
			config: {
				type: 'indirectType',
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				overrides: {
					'parentType > contextType': {
						menu: [
							{action:'parentAction',label:'merge'}
						]
					}
				}
			},
		} as StoreMeta], {path:['parentType', 'indirectType', 'contextType']} as ContextAction)

		expect(result).toEqual([
			{action:'actionName',label:'test'}
		])
	})
	test('calls menu generation methods, child first when provided', () => {
		const parentMenu = [
			{action:'parentAction',label:'test'}
		]
		const childMenu = [
			{action:'actionName',label:'test'}
		]
		const contextMenuGen = jest.fn().mockReturnValue(childMenu)
		const parentMenuGen = jest.fn().mockReturnValue(parentMenu)
		const action = {path:['parentType', 'contextType']} as ContextAction
		const result = contextsDecideMenu(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				menu: contextMenuGen
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				overrides: {
					'parentType contextType': {menu: parentMenuGen}
				}
			},
		} as StoreMeta], action)

		expect(result).toEqual(parentMenu)
		expect(parentMenuGen).toHaveBeenCalledTimes(1)
		expect(contextMenuGen).toHaveBeenCalledTimes(1)
		expect(contextMenuGen).toBeCalledWith(action, [], null)
		expect(parentMenuGen).toBeCalledWith(action, childMenu, null)
	})
})