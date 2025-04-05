import React from 'react'

import classes from './classes'
import Context from '@/components/Context'
import { ContextConfig } from '@/types/index.types'
import { ContextMenuItemProps } from './index.types'
import displayKeys from '@/generic/string/transformers/display-keys'
import iconMap from '@/constants/icon-map'
import { css } from '@emotion/react'

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
	return (
		<Context
			context={context}
			data={{
				ContextMenuItem_id: id,
				ContextMenuItem_data: data,
				ContextMenuItem_action: action,
			}}
			css={css`
				display: flex;
				justify-content: space-between;
				column-gap: 1em;
				padding: 0.5em 1em;
				border-top: 1px solid #eee;
				&:first-of-type {
					borderTop: none;
				}
				${disabled ? 'color: #bbb;' : `
				&:hover {
					background: #44d;
					color: #fff;
					cursor: pointer;
				}`}`}
			className={classes.ContextMenuItem + ' ' + (disabled ? classes.ContextMenuItemDisabled : '')}
			{...passedProps}
		>
			<div className={classes.ContextMenuItemLabel} css={css`white-space: nowrap;`}>{label || passedProps.title || '(Item)'}</div>
			{keys && keys.length ? (
				<div className={classes.ContextMenuItemKeys} css={css`
					color: #999;
					white-space: nowrap;
					font-size: 0.8em;
					padding-top: 0.125em;
				`}>{displayKeys(keys, iconMap)}</div>
			) : null}
		</Context>
	)
}

ContextMenuItem.title = 'ContextMenu'

export default ContextMenuItem
