import React from 'react'

import classes from './classes'
import Context from '@/components/Context'
import { ContextConfig } from '@/types/index.types'
import { ContextMenuItemProps } from './index.types'
import displayKeys from '@/generic/string/transformers/display-keys'
import useStyles from './style'
import iconMap from '@/constants/icon-map'

const context: ContextConfig = {
	type: 'context-menu-item',
	acts: (_action, acts) => ({
		select: {
			keys: ['Click', 'Enter', 'Space'],
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
	...passedProps
}: ContextMenuItemProps): React.ReactElement {
	const styles = useStyles()
	return (
		<Context
			context={context}
			data={{
				ContextMenuItem_id: id,
				ContextMenuItem_data: data,
				ContextMenuItem_action: action,
			}}
			className={classes.ContextMenuItem + ' ' + (disabled ? styles[classes.ContextMenuItemDisabled] : styles[classes.ContextMenuItem])}
			{...passedProps}
		>
			<div className={styles[classes.ContextMenuItemLabel]}>{label || passedProps.title || '(Item)'}</div>
			{keys && keys.length ? (
				<div className={styles[classes.ContextMenuItemKeys]}>{displayKeys(keys, iconMap)}</div>
			) : null}
		</Context>
	)
}

ContextMenuItem.title = 'ContextMenu'

export default ContextMenuItem
