import {
	ContextId,
	StoreMetaGroup,
	ContextConfig,
	ContextDataGenerator,
	ContextData,
	ContextInterceptGroup,
	StoreMetaList,
	ContextEvent,
	ContextActionName,
	ContextActionNameConfig,
	ContextKeyList,
	ContextActMenuItemList,
} from '@/types/index.types'
import { HandleConfig } from '@/types/dom-events.types'
import { EventHandler, EVENT_NAMES } from '@/types/dom-events.types'
import { ContextSystemApi, ContextSystemConfig } from '@/types/system.types'
import { UNHANDLED } from '@/constants/handled'

import { inactiveLog as log } from '@/side-effects/debug-log'
import bindEvent from '@/side-effects/bind-event'

import CONTEXT_CLASS from '@/constants/context-class'
import { contextTriggerAction } from '@/handle/action'
import contextHandleGlobalEvent from '@/handle/global'
import contextHandleLocalEvent from '@/handle/local'
import provideEnvironment from '@/system/render-environment'

import keyDown from '@/dom-events/key-down'
import keyUp from '@/dom-events/key-up'
import click from '@/dom-events/click'
import doubleClick from '@/dom-events/double-click'
import mouseDown from '@/dom-events/mouse-down'
import mouseUp from '@/dom-events/mouse-up'
import contextsDecideActMenu from '../transformers/contexts-decide-act-menu'
import {actMenuApplyData} from '@/transformers/menu-apply-metadata'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import humanise from '@/generic/string/transformers/humanise'
import storeMetaHasType from '../transformers/store-meta-has-type'
import defaultConfiguration from './default-config'

/**
 * BUSSINESS LOGIC
 * This IS the App
 * 
 * All globals and side-effects should be configured through here
 * 
 * @param rootElement the root element to be interacted with
 * @returns An API for creating context menus, triggering actions, and handling events
 */
const initialiseContextSystem = (rootElement: HTMLElement, configuration: Partial<ContextSystemConfig> = {}): ContextSystemApi => {
	const fullConfiguration = Object.assign({}, defaultConfiguration, configuration)
	let focussedContext: ContextId | null = null
	let _contextId: number = 0
	const contextMetas: StoreMetaGroup = {}

	/**
	 * Gets a list of contexts from the leaf node to the root
	 * 
	 * @param id The ID of the leaf context
	 * 
	 * @returns [leaf, ...to, root] A list containing the context with the given ID
	 *          and all its ancestor contexts, from [leaf, ...to, root]
	 * @returns [] An empty list if the context ID is invalid
	 */
	const getContexts = (id: ContextId | null): StoreMetaList => {
		if (!id) return []

		const context = contextMetas[id]
		if (!context) return []

		const { root, parent } = context
		if (root || !parent) return [context]

		return [context, ...getContexts(parent)]
	}
	/**
	 * Remove a context from the context system store
	 * 
	 * @param contextId The ID of the context to be removed
	 */
	const removeContext = (contextId: ContextId): void => {
		contextMetas[contextId] = undefined // { id, parent }
	}

	/**
	 * Add a context to the context system store
	 * @param param0 
	 */
	const addContext = ({
		id,
		intercept,
		outercept,
		parent,
		root,
		data,
		context,
	}: {
		id: ContextId;
		parent: null | ContextId;
		root: boolean;
		context: ContextConfig | null;
		data: ContextData | ContextDataGenerator | null;
		intercept: ContextInterceptGroup | null;
		outercept: ContextInterceptGroup | null;
	}): void => {
		contextMetas[id] = {
			id,
			parent,
			root,
			data,
			config: context || {},
			intercept,
			outercept,
		}
	}

	/**
	 * Is the context with the given ID the tiggering context (the closest context related to given event)
	 * 
	 * @param id 
	 * @param event 
	 * 
	 * @returns true if the context is related to the event
	 * @returns false if the context is not related to the event
	 */
	const isFocus = (id: ContextId, event: Event): boolean => {
		const focus = (event.target as HTMLElement).closest<HTMLElement>(`.${CONTEXT_CLASS}`)
		return id === focus?.dataset.contextid
	}

	/**
	 * Trigger named actions from a specific context
	 * @param id
	 * @returns
	 */
	const triggerAction =
		(id: ContextId) =>
			(
				action: ContextActionName,
				event: ContextEvent,
				data?: ContextData | ContextDataGenerator,
			): symbol | Promise<unknown> => {
				log('trigger action API', { id, action, event, data })
				if (!action) throw new Error('Action must be provided')
				if (typeof action !== 'string') throw new Error('Action must be a string')

				return contextTriggerAction(contextSystemApi, id, action, event, data)
			}

	/**
	 * Handle events triggered by local listeners
	 * @param id
	 * @param onAction
	 * @returns
	 */
	const handleLocalEvent =
		(id: ContextId, onAction: ContextActionNameConfig) =>
			(event: Event): false | void => {
				log('handle local event API', { id, onAction, event })
				const handled = contextHandleLocalEvent(contextSystemApi, id, onAction, event)
				if (handled === UNHANDLED) return undefined
				event.preventDefault()
				return false
			}

	const currentKeys: Record<string, boolean> = {}

	const setKey = (key: string, active: boolean): void => {
		currentKeys[key] = active
	}

	const getCombination = (): ContextKeyList =>
		Object.entries(currentKeys)
			.filter(([, val]) => val)
			.map(([key]) => key)

	/**
	 * Handle events triggered by the global listeners
	 *
	 * @param handleConfig A config determining the handling process
	 * @returns
	 */
	const handleGlobalEvent: EventHandler = <E extends Event = Event>(handleConfig: HandleConfig<E>) => (event: E) => {
		log('handleGlobalEvent', handleConfig)
		let ret: undefined | false
		if (handleConfig.before) {
			const keySet = handleConfig.before(event)
			if (keySet)
				Object.entries(keySet).forEach(([key, active]) => {
					setKey(key, active)
				})
		}
		if (handleConfig.keyInfo) {
			const keyInfo = handleConfig.keyInfo(event)
			if (keyInfo) {
				const handled = contextHandleGlobalEvent(contextSystemApi, {
					...keyInfo,
					combination: getCombination(),
					target: event.target,
				})
				if (handled !== UNHANDLED) {
					event.preventDefault()
					ret = false
				}
			}
		}
		if (handleConfig.after) {
			const keySet = handleConfig.after(event)
			if (keySet)
				Object.entries(keySet).forEach(([key, active]) => {
					setKey(key, active)
				})
		}
		return ret
	}

	bindEvent(rootElement, EVENT_NAMES.KEY_DOWN, handleGlobalEvent(keyDown))
	bindEvent(rootElement, EVENT_NAMES.KEY_UP, handleGlobalEvent(keyUp))

	bindEvent(rootElement, EVENT_NAMES.MOUSE_DOWN, handleGlobalEvent(mouseDown))
	bindEvent(rootElement, EVENT_NAMES.MOUSE_UP, handleGlobalEvent(mouseUp))

	bindEvent(rootElement, EVENT_NAMES.CLICK, handleGlobalEvent(click))
	bindEvent(rootElement, EVENT_NAMES.DOUBLE_CLICK, handleGlobalEvent(doubleClick))

	const environment = provideEnvironment(rootElement)

	const contextSystemApi: ContextSystemApi = {
		set focussedContext(newFocussedContext: ContextId | null) {
			focussedContext = newFocussedContext
		},
		get focussedContext(): ContextId | null {
			return focussedContext
		},
		get configuration() {
			return fullConfiguration
		},
		newId: (): ContextId => String(++_contextId),
		addContext,
		removeContext,
		getContexts,
		isFocus,
		triggerAction,
		handleLocalEvent,
		addContextMenu: async (id, event) => {
			const contexts = getContexts(id)
			const menu = contexts
				.reverse().filter(storeMetaHasType)
				.reduce((parentMenu: ContextActMenuItemList, { id: currentId }, index, list): ContextActMenuItemList => {
					const parentMeta = index === 0 ? null : list[index - 1]
					const parentInfo = parentMeta ? {
						label: parentMeta.config.label || humanise(parentMeta.config.type),
						type: parentMeta.config.type,
						menu: parentMenu,
					} : null
					const currentContexts = getContexts(currentId)
					const actMenu = contextsDecideActMenu(fullConfiguration, currentContexts, event, parentInfo)
					return actMenuApplyData(
						actMenu,
						{
							[MENU_ITEM_ID]: currentId,
						}
					)
				}, [])
			if (!menu.length)
				throw new Error('No menu items')

			event.preventDefault()
			const pos = {
				x: event.pageX,
				y: event.pageY,
			}
			return environment.addMenu(contextSystemApi, { pos, menu, level: 0 })
		},
		addMenu: (pos, menu, level = 0) =>
			environment.addMenu(contextSystemApi, { pos, menu, level }),
	}

	return contextSystemApi
}
export default initialiseContextSystem
