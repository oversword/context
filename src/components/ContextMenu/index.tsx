import React from 'react'

import Context from '@/components/Context'
import {
	ContextApi,
	ContextConfig,
	ContextMenuItemMode,
	ContextIntercept,
	ContextActMenuItem as ContextMenuItemType,
	BasicContextActMenuItem,
	ContextAction,
} from '@/types/index.types'
import ContextMenuItem from '@/components/ContextMenuItem'
import DataContext from '@/components/DataContext'
import classes from './classes'
import itemClasses from '@/components/ContextMenuItem/classes'
import { ContextMenuProps } from './index.types'
import SystemContext from '@/constants/system-context'
import { ContextMenuResult, ContextSystemApi } from '@/types/system.types'
import { inactiveLog as log } from '@/side-effects/debug-log'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import menuFindItem from '@/transformers/menu-find-item'
import Cancelable, { CanceledError } from '@/generic/promise/classes/cancelable'

const OPEN_BRANCH = Symbol('open-branch')
const MENU_ERROR = Symbol('menu-error')

const context: ContextConfig = {
	type: 'ContextMenu',
	acts: (_action, acts) => ({
		load: {},
		action: {},
		close: {
			keys: ['Escape']
		},
		...acts,
	}),
}

const renderMenuItem = (menuItem: ContextMenuItemType, contextSystem: ContextSystemApi, openMenus: Record<string, Cancelable<ContextMenuResult>>) => {
	if ('mode' in menuItem && menuItem.mode === ContextMenuItemMode.section) {
		return (
			<div className={classes.ContextMenuSection} key={menuItem.id}>
				{menuItem.label ? (
					<div className={classes.ContextMenuSectionLabel}>{menuItem.label}</div>
				) : null}
				{(menuItem.children || []).map(childItem => renderMenuItem(childItem, contextSystem, openMenus))}
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
					label={menuItem.label}
					icon={menuItem.icon}
					endIcon={contextSystem.configuration.branchIcon}
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
				icon={menuItem.icon}
				action={menuItem.action || MENU_ERROR}
				data={menuItem.data}
				disabled={menuItem.disabled}
				keys={menuItem.keys}
			/>
		</DataContext>
	)
}

function ContextMenu({
	menu = [{ id: 'no-actions', label: 'No Actions', mode: ContextMenuItemMode.section, action: '', keys: [], disabled: true, data: {}, icon: null, [MENU_ITEM_ID]: 'no-actions' } as BasicContextActMenuItem],
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

	const [openMenus, setOpenMenus] = React.useState<Record<string, Cancelable<ContextMenuResult>>>({})
	const [canceledMenus, setCanceledMenus] = React.useState<Record<string, Cancelable<void>>>({})

	const open_branch = ({ event, data }: ContextAction) => {
		const key = data.ContextMenu_key as string
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

		const cancelable = contextSystem
			.addMenu(pos, item.children, level + 1)

		setOpenMenus({...openMenus,[key]: cancelable})

		cancelable.catch(() => ({}) as ContextMenuResult)
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
	}
	const close_branch = (key: string) => {
		const { [key]: _, ...newOpenMenus } = openMenus
		setOpenMenus({ ...newOpenMenus })
	}
	const handleItemSelect: ContextIntercept = action => {
		if (action.data.ContextMenuItem_action === OPEN_BRANCH) {
			const key = action.data.ContextMenu_key as string
			if (openMenus[key]) {
				openMenus[key].cancel()
				close_branch(key)
				return
			}
			open_branch(action)
		} else {
			contextRef.current?.trigger('action', action.event, {
				ContextMenu_id: action.data.ContextMenuItem_id,
				ContextMenu_action: action.data.ContextMenuItem_action,
				ContextMenu_data: action.data.ContextMenuItem_data,
			})
		}
	}
	const handleItemHover: ContextIntercept = action => {
		const key = action.data.ContextMenu_key as string
		if (!openMenus[key]) {
			if (action.data.ContextMenuItem_action === OPEN_BRANCH) {
				open_branch(action)
				return
			}
		} if (!canceledMenus[key]) {
			setCanceledMenus({...canceledMenus, ...Object.fromEntries(Object.entries(openMenus).map(([key,menuCancelable]) => {
				const cancelable = new Cancelable<void>((resolve, _reject, onCancel) => {
					let timeout = null;
					(new Promise((resolve, reject) => {
						timeout = setTimeout(resolve, 500)
						onCancel(reason => {
							if (timeout !== null) clearInterval(timeout)
							reject(reason)
						})
					})).then(() => {
						menuCancelable.cancel('Timeout')
						timeout = null
						close_branch(key)
						resolve(undefined)
					}).catch(() => {})
				})
				cancelable.catch(e => { if (!(e instanceof CanceledError)) throw e })
				return [key,cancelable]
			}))})
		} else {
			canceledMenus[key].cancel('Re-enter')
			const { [key]: _, ...newCanceledMenus } = canceledMenus
			setCanceledMenus({ ...newCanceledMenus })
		}
	}

	return (
		<Context
			className={classes.ContextMenu}
			{...passedProps}
			apiRef={contextRef}
			context={context}
			intercept={{
				'ContextMenuItem.select': handleItemSelect,
				'ContextMenuItem.hover': handleItemHover,
				...intercept,
			}}
			autoFocus
			root
		>
			{menu.map(menuItem => renderMenuItem(menuItem, contextSystem, openMenus))}
		</Context>
	)
}

ContextMenu.title = 'ContextMenu'

export default ContextMenu
