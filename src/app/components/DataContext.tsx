import React from 'react'

import ReactContext from '../constants/react-context'
import SystemContext from '../constants/system-context'
import { ContextApi, ContextId, DataContextProps } from '../types/index.types'
import wrapElements from '../utils/wrap-elements'

const DataContext = React.forwardRef(function Context(
	{
		children = null,
		DataContext = null,
		context = null,
		data = null,
		intercept = null,
		outercept = null,
		root = false,
	}: DataContextProps,
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
	const internalContext = DataContext || context

	const parent = React.useContext(ReactContext) || null

	React.useImperativeHandle(forwardRef, (): ContextApi => {
		const trigger = contextSystem.triggerAction(id)
		return {
			trigger,
			triggerAction: trigger,
			get element(): undefined {
				return undefined
			},
		}
	})

	React.useEffect(() => {
		contextSystem.addContext({
			id,
			parent,
			root,
			intercept,
			outercept,
			data,
			context: internalContext,
		})
		return () => contextSystem.removeContext(id)
	}, [id, parent, root, intercept, outercept, internalContext, data])

	return <ReactContext.Provider value={id}>{...internalChildren}</ReactContext.Provider>
})

export default DataContext
