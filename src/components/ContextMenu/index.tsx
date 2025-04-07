import React from 'react'

import Context from '@/components/Context'
import {
	ContextApi,
	ContextConfig,
	ContextMenuItemMode,
	ContextIntercept,
	ContextActMenuItem as ContextMenuItemType,
	BasicContextActMenuItem,
} from '@/types/index.types'
import ContextMenuItem from '@/components/ContextMenuItem'
import DataContext from '@/components/DataContext'
import classes from './classes'
import itemClasses from '@/components/ContextMenuItem/classes'
import { ContextMenuProps } from './index.types'
import SystemContext from '@/constants/system-context'
import { ContextMenuResult } from '@/types/system.types'
import { inactiveLog as log } from '@/side-effects/debug-log'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import { css } from '@emotion/react'
import menuFindItem from '@/transformers/menu-find-item'

const OPEN_BRANCH = Symbol('open-branch')
const MENU_ERROR = Symbol('menu-error')

const context: ContextConfig = {
	type: 'context-menu',
	acts: (_action, acts) => ({
		load: {},
		action: {},
		close: {
			keys: ['Escape']
		},
		...acts,
	}),
}

const renderMenuItem = (menuItem: ContextMenuItemType) => {
	if ('mode' in menuItem && menuItem.mode === ContextMenuItemMode.section) {
		return (
			<div className={classes.ContextMenuSection} css={css`
				padding: 0;
				border-top: 1px solid;
				display: block;
				&:first-of-type {
					borderTop: none;
			}`} key={menuItem.id}>
				{menuItem.label ? (
					<div className={classes.ContextMenuSectionLabel} css={css`
						padding: 0.5em 1em;
						color: #888;
						font-size: 0.9em;
						white-space: nowrap;
					`}>{menuItem.label}</div>
				) : null}
				{(menuItem.children || []).map(childItem => renderMenuItem(childItem))}
			</div>
		)
	}
	if ('mode' in menuItem && menuItem.mode === ContextMenuItemMode.branch) {
		return (
			<DataContext
				data={{
					ContextMenu_key: menuItem.id,
				}}
				key={menuItem.id}
			>
				<ContextMenuItem
					id={menuItem[MENU_ITEM_ID]}
					label={`${menuItem.label}...`}
					action={OPEN_BRANCH}
					disabled={menuItem.disabled}
				/>
			</DataContext>
		)
	}
	return (
		<DataContext
			data={{
				ContextMenu_key: menuItem.id,
			}}
			key={menuItem.id}
		>
			<ContextMenuItem
				id={menuItem[MENU_ITEM_ID]}
				label={menuItem.label}
				action={menuItem.action || MENU_ERROR}
				data={menuItem.data}
				disabled={menuItem.disabled}
				keys={menuItem.keys}
			/>
		</DataContext>
	)
}

function ContextMenu({
	menu = [{ id: 'no-actions', label: 'No Actions', mode: ContextMenuItemMode.section, action: '', keys: [], disabled: true, data: {}, [MENU_ITEM_ID]: 'no-actions' } as BasicContextActMenuItem],
	level = 0,
	intercept = {},
	...passedProps
}: ContextMenuProps): React.ReactElement {
	const contextSystem = React.useContext(SystemContext) || null
	if (!contextSystem) {
		throw new Error('A context system must be provided via the SystemContext.Provider component.')
	}

	const contextRef = React.useRef<ContextApi>(null)
	React.useEffect(() => {
		if (!(contextRef.current && contextRef.current.element)) return

		contextRef.current.trigger('load')
	}, [contextRef.current && contextRef.current.element])

	const handleItemSelect: ContextIntercept = ({ event, data }) => {
		if (data.ContextMenuItem_action === OPEN_BRANCH) {
			const key = data.ContextMenu_key
			const item = menuFindItem(menu, menuItem => 'mode' in menuItem && menuItem.mode === ContextMenuItemMode.branch && menuItem.id === key)

			if (!item) throw new Error('Menu item does not exist')
			if (!('children' in item)) throw new Error('Menu item has no children to open')
			if (!event) throw new Error('Event does not exist')
			if (!('target' in event) || !event.target)
				throw new Error('Menu item element does not exist')

			const bounds = (event.target as HTMLElement)
				.closest<HTMLElement>(`.${itemClasses.ContextMenuItem}`)
				?.getBoundingClientRect()
			if (!bounds) throw new Error('Menu item bounds do not exist')

			const pos = {
				x: bounds.left,
				y: bounds.top,
				w: bounds.width,
				h: bounds.height,
			}

			contextSystem
				.addMenu(pos, item.children, level + 1)
				.catch(() => ({}) as ContextMenuResult)
				.then(result => {
					log(result)
					if (!result) return
					const { action, data, id } = result
					if (!action) return
					log('Sub Menu:', result, {
						ContextMenu_id: id,
						ContextMenu_action: action,
						ContextMenu_data: data,
					}, contextRef.current, contextRef)
					contextRef.current?.trigger('action', event, {
						ContextMenu_id: id,
						ContextMenu_action: action,
						ContextMenu_data: data,
					})
				})
		} else {
			contextRef.current?.trigger('action', event, {
				ContextMenu_id: data.ContextMenuItem_id,
				ContextMenu_action: data.ContextMenuItem_action,
				ContextMenu_data: data.ContextMenuItem_data,
			})
		}
	}

	return (
		<Context
			className={classes.ContextMenu}
			css={css`
				font-family: sans-serif;
				font-size: 14px';
				user-select: none;
				background: #fff;
				color: #111;
				box-shadow: 0 3px 9px -2px rgba(0, 0, 0, 0.5);
				border-radius: 3px;`}
			{...passedProps}
			ref={contextRef}
			context={context}
			intercept={{
				'context-menu-item.select': handleItemSelect,
				...intercept,
			}}
			autoFocus
			root
		>
			{menu.map(renderMenuItem)}
		</Context>
	)
}

ContextMenu.title = 'ContextMenu'

export default ContextMenu
