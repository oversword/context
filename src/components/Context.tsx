import React from 'react'

import EmptyMenuError from '@/errors/empty-menu-error'

import { ContextActionNameConfig, ContextApi, ContextId, ContextProps } from '@/types/index.types'
import wrapElements from './wrap-elements'
import ReactContext from '@/constants/react-context'
import SystemContext from '@/constants/system-context'
import CONTEXT_CLASS from '@/constants/context-class'
import { inactiveLog as log } from '@/side-effects/debug-log'

/**
 * Context wrapper component
 *
 * Too complex, see README for API
 */
const Context = function Context<P extends object>(
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
		onFocusAction = null,
		onChangeAction = null,
		onClickAction = null,
		onDoubleClickAction = null,
		onMouseDownAction = null,
		onMouseUpAction = null,
		onMouseMoveAction = null,
		onMouseEnterAction = null,
		onMouseLeaveAction = null,
		onMouseOverAction = null,
		onMouseOutAction = null,
		root = false,
		ref = undefined,
		apiRef = undefined,
		...passedProps
	}: React.PropsWithChildren<ContextProps<P> & P>,
): React.ReactElement {
	const contextSystem = React.useContext(SystemContext) || null
	if (!contextSystem) {
		throw new Error('A context system must be provided via the SystemContext.Provider component.')
	}

	const idRef = React.useRef<ContextId>('')
	if (!idRef.current) idRef.current = contextSystem.newId()
	const id = idRef.current

	const internalChildren = wrapElements(children)
	const internalContext = Context || context
	const internalElement = element || 'div'

	const elementRef = React.useRef<HTMLElement>(null)
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

	React.useImperativeHandle(apiRef, (): ContextApi => {
		const trigger = contextSystem.triggerAction(id)
		return {
			trigger,
			triggerAction: trigger,
			get element(): undefined | HTMLElement {
				return elementRef.current
			},
		}
	})
	React.useImperativeHandle(ref, (): HTMLElement => elementRef.current)


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
	}, [])

	const handleFocus = (event: FocusEvent): void => {
		// Focus this element if it is the closest context to the target
		if (event.target !== elementRef.current) {
			if (!(event.target instanceof Node) || !elementRef.current.contains(event.target)) return
			let parent: Node | null = event.target
			while (parent && (parent !== elementRef.current)) {
				if ((parent instanceof HTMLElement) && ('contextid' in parent.dataset)) return
				parent = parent.parentNode
			}
		}

		if (onFocus) onFocus(event)
		if (onFocusAction) contextSystem.handleLocalEvent(id, onFocusAction)(event)
		if (!contextSystem.isFocus(id, event)) return

		contextSystem.focussedContext = id
	}
	const handleContextMenu = (event: MouseEvent): void => {
		log('Context Menu', { id, event })
		if (!contextSystem.isFocus(id, event)) return log('Context Menu: Not Focus', { id })

		const persistentEvent = { ...event }
		contextSystem
			.addContextMenu(id, event)
			.then(result => {
				contextSystem.closeMenu('root')
				if (!result) return log('Context Menu: No Result', { result })

				const { action, data: overrideData, id: actionContextId } = result
				if (!action) return log('Context Menu: No Action', { action, data, result })

				log('Context Menu Done', { action, overrideData, id: actionContextId })
				return contextSystem.triggerAction(actionContextId)(action, persistentEvent, overrideData)
			})
			.catch((error) => {
				if (error instanceof EmptyMenuError) return
				contextSystem.closeMenu('root')
			})
		return log('Context Menu Success', { id, event })
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
					...userEvent('onMouseEnter', onMouseEnterAction),
					...userEvent('onMouseLeave', onMouseLeaveAction),
					...userEvent('onMouseOver', onMouseOverAction),
					...userEvent('onMouseOut', onMouseOutAction),
					...userEvent('onMouseUp', onMouseUpAction),
					...userEvent('onChange', onChangeAction),
					'data-contextid': id,
					ref: elementRef,
				} as P,
				...internalChildren,
			)}
		</ReactContext.Provider>
	)
}

export default Context
