import React from 'react'

import classes from './classes'
import Context from '@/components/Context'
import { ContextConfig, ContextProps } from '@/types/index.types'
import { ContextMenuItemProps } from './index.types'
import displayKeys from '@/generic/string/transformers/display-keys'
import iconMap from '@/constants/icon-map'

const context: ContextConfig = {
	type: 'ContextMenuItem',
	acts: (action, acts) => ({
		hover: {},
		select: {
			keys: ['Click', 'Enter', 'Space'],
			disabled: Boolean(action.data.ContextMenuItem_disabled)
		},
		...acts,
	}),
}

function ContextMenuItem({
	id,
	keys = [],
	action = 'error',
	data = null,
	label = null,
	disabled = false,
	icon = null,
	endIcon = null,
	...passedProps
}: React.PropsWithChildren<ContextMenuItemProps & ContextProps>): React.ReactElement {
	return (
		<Context
			context={context}
			data={{
				ContextMenuItem_id: id,
				ContextMenuItem_data: data,
				ContextMenuItem_action: action,
				ContextMenuItem_disabled: disabled,
			}}
			className={classes.ContextMenuItem + ' ' + (disabled ? classes.ContextMenuItemDisabled : '')}
			onMouseEnterAction="hover"
			{...passedProps}
		>
			<div className={classes.ContextMenuItemContent}>
				<div className={classes.ContextMenuItemIcon + ' ' +(icon ? '' : classes.ContextMenuItemIconEmpty)}>{icon}</div>
				<div className={classes.ContextMenuItemLabel}>{label || passedProps.title || '(Item)'}</div>
			</div>
			{endIcon ? <div className={classes.ContextMenuItemEndIcon} >{endIcon}</div> : null}
			{keys && (!endIcon) && keys.length ? (
				<div className={classes.ContextMenuItemKeys}>{displayKeys(keys, iconMap)}</div>
			) : null}
		</Context>
	)
}

ContextMenuItem.title = 'ContextMenu'

export default ContextMenuItem
