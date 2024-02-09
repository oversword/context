import React from 'react'

import { ContextActionNameConfig, ContextApi, ContextId, ContextProps } from '../types/index.types'
import wrapElements from './wrap-elements'
import ReactContext from '../constants/react-context'
import SystemContext from '../constants/system-context'
import CONTEXT_CLASS from '../constants/context-class'
import { ContextMenuResult } from '../types/system.types'
import { inactiveLog as log } from '../side-effects/debug-log'

/**
 * Context wrapper component
 *
 * Too complex, see README for API
 */
const Context = React.forwardRef(function Context(
	{
		children = null,
		Context = null,
		context = null,
		focus = true,
		onFocus = null,
		element = 'div',
		data = null,
		intercept = null,
		outercept = null,
		tabIndex = 0,
		onClickAction = null,
		onDoubleClickAction = null,
		onMouseDownAction = null,
		onMouseUpAction = null,
		onMouseMoveAction = null,
		onChangeAction = null,
		root = false,
		...passedProps
	}: ContextProps,
	forwardRef,
): React.ReactElement {
	const contextSystem = React.useContext(SystemContext) || null
	if (!contextSystem) {
		throw new Error('A context system must be provided via the SystemContext.Provider component.')
	}

	const idRef = React.useRef<ContextId>()
	if (!idRef.current) idRef.current = contextSystem.newId()
	const id = idRef.current

	const internalChildren = wrapElements(children)
	const internalContext = Context || context
	const internalElement = element || 'div'

	const elementRef = React.useRef<HTMLElement>()
	const parent = React.useContext(ReactContext) || null

	const userEvent = (
		name: string,
		onAction: ContextActionNameConfig | null,
	): { [key: string]: ((event: Event) => false | void) } =>
		onAction
			? {
				[name]: contextSystem.handleLocalEvent(id, onAction),
			}
			: {}

	React.useImperativeHandle(forwardRef, (): ContextApi => {
		const trigger = contextSystem.triggerAction(id)
		return {
			trigger,
			triggerAction: trigger,
			get element(): undefined | HTMLElement {
				return elementRef.current
			},
		}
	})

	React.useEffect(() => {
		contextSystem.addContext({
			id,
			root,
			parent,
			intercept,
			outercept,
			data,
			context: internalContext,
		})
		return () => contextSystem.removeContext(id)
	}, [id, parent, intercept, outercept, internalContext, data])

	React.useEffect(() => {
		// AutoFocus the element if enabled

		if (!passedProps.autoFocus) return

		elementRef.current?.focus()
		if (onFocus) onFocus()

		contextSystem.focussedContext = id
	}, [])

	const handleFocus = (event: FocusEvent): void => {
		if (event.target !== elementRef.current) return

		if (onFocus) onFocus(event)
		if (!contextSystem.isFocus(id, event)) return

		contextSystem.focussedContext = id
	}
	const handleContextMenu = (event: MouseEvent): void => {
		log('Context Menu', { id, event })
		if (!contextSystem.isFocus(id, event)) return log('Context Menu: Not Focus', { id })

		const menu = contextSystem.decideMenuConfig(id, event)
		if (!menu.length) return log('Context Menu: No Menu', { id })

		event.preventDefault()
		const pos = {
			x: event.pageX,
			y: event.pageY,
		}
		const persistentEvent = { ...event }
		contextSystem
			.contextMenu(pos, menu)
			.catch(() => ({}) as ContextMenuResult)
			.then(result => {
				if (!result) return log('Context Menu: No Result', { result })

				const { action, data: overrideData } = result
				if (!action) return log('Context Menu: No Action', { action, data, result })

				log('Context Menu Done', { action, overrideData, id })
				return contextSystem.triggerAction(id)(action, persistentEvent, overrideData)
			})
			.then(() => {
				// Re-focus this element
				elementRef.current?.focus()
				if (onFocus) onFocus()

				contextSystem.focussedContext = id
			})
		return log('Context Menu Success', { menu, pos })
	}

	return (
		<ReactContext.Provider value={id}>
			{React.createElement(
				internalElement,
				{
					...passedProps,
					className: `${passedProps.className || ''} ${CONTEXT_CLASS}`,
					onFocus,
					...(focus ? { tabIndex, onFocus: handleFocus, onContextMenu: handleContextMenu } : {}),
					...userEvent('onClick', onClickAction),
					...userEvent('onDoubleClick', onDoubleClickAction),
					...userEvent('onMouseMove', onMouseMoveAction),
					...userEvent('onMouseDown', onMouseDownAction),
					...userEvent('onMouseUp', onMouseUpAction),
					...userEvent('onChange', onChangeAction),
					'data-contextid': id,
					ref: elementRef,
				},
				...internalChildren,
			)}
		</ReactContext.Provider>
	)
})

export default Context
