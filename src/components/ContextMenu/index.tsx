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
	ContextMenuApi,
} from '@/types/index.types'
import ContextMenuItem from '@/components/ContextMenuItem'
import DataContext from '@/components/DataContext'
import classes from './classes'
import itemClasses from '@/components/ContextMenuItem/classes'
import { ContextMenuProps } from './index.types'
import SystemContext from '@/constants/system-context'
import { CanceledEvent, ClosedEvent, ContextSystemApi, ContxtMenuRendererInterruptable, DestroyedEvent } from '@/types/system.types'
import { inactiveLog as log } from '@/side-effects/debug-log'
import { MENU_ITEM_ID } from '@/constants/menu-item'
import menuFindItem from '@/transformers/menu-find-item'
import Interruptable from '@/generic/promise/classes/interruptable'

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

const renderMenuItem = (menuItem: ContextMenuItemType, contextSystem: ContextSystemApi, openMenus: Record<string, ContxtMenuRendererInterruptable>) => {
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
				context={{
					overrides: {
						ContextMenuItem: {
							acts: {
								select: {
									keys: ['Click'],
								},
								goto: {
									keys: ['Enter', 'Space'],
								}
							}
						}
					}
				}}
			>
				<ContextMenuItem
					id={menuItem[MENU_ITEM_ID]}
					label={menuItem.label}
					icon={menuItem.icon}
					endIcon={contextSystem.configuration.branchIcon}
					action={OPEN_BRANCH}
					disabled={menuItem.disabled}
					data-menuid={menuItem.id}
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
	id,
	intercept = {},
	apiRef = null,
	...passedProps
}: ContextMenuProps): React.ReactElement {
	const contextSystem = React.useContext<ContextSystemApi>(SystemContext) || null
	if (!contextSystem) {
		throw new Error('A context system must be provided via the SystemContext.Provider component.')
	}

	const contextRef = React.useRef<ContextApi>(null)
	
	React.useEffect(() => {
		if (!(contextRef.current && contextRef.current.element)) return

		contextRef.current.trigger('load')
	}, [contextRef.current && contextRef.current.element])


	const [openMenus, setOpenMenus] = React.useState<Record<string, ContxtMenuRendererInterruptable>>({})
	const [canceledMenus, setCanceledMenus] = React.useState<Record<string, Interruptable<void, CanceledEvent>>>({})

	React.useImperativeHandle(apiRef, (): ContextMenuApi => {
		return {
			...contextRef.current,
			openMenus,
			canceledMenus
		}
	}, [openMenus, canceledMenus])

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
			.addMenu({
				id: id+key,
				pos,
				menu: item.children,
				parent: id,
				level: level + 1
			})

		setOpenMenus({ ...openMenus, [key]: cancelable })

		cancelable
			.then(result => {
				clear_menu(key)
				clear_canceled(key)
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
			.catch((reason) => {
				if (reason instanceof DestroyedEvent) return
				if (reason instanceof ClosedEvent) {
					const branch = contextRef.current.element.querySelector<HTMLElement>(`[data-menuid='${key}']`)
					branch?.focus()
				}
				clear_menu(key)
				clear_canceled(key)
				contextSystem.closeMenu(id+key)
			})
		return cancelable
	}
	const clear_menu = (key: string) => {
		setOpenMenus((openMenus) => {
			const { [key]: _, ...newOpenMenus } = openMenus
			return { ...newOpenMenus }
		})
	}
	const clear_canceled = (key: string) => {
		setCanceledMenus((value) => {
			const { [key]: _, ...rest } = value
			return rest
		})
	}
	const handleItemSelect: ContextIntercept = action => {
		if (action.data.ContextMenuItem_action === OPEN_BRANCH) {
			const key = action.data.ContextMenu_key as string
			if (openMenus[key]) {
				openMenus[key].interrupt(new CanceledEvent('Clicked Branch While Open'))
				clear_menu(key)
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
	const handleItemFocus: ContextIntercept = action => {
		const key = action.data.ContextMenu_key as string
		if (!openMenus[key]) {
			if (action.data.ContextMenuItem_action === OPEN_BRANCH) {
				open_branch(action)
				return
			}
		} if (!canceledMenus[key]) {
			setCanceledMenus({
				...canceledMenus,
				...Object.fromEntries(Object.entries(openMenus)
					.filter(([otherKey]) => otherKey!==key && !(otherKey in canceledMenus))
					.map(([otherKey,menuCancelable]) => {
						const cancelable = new Interruptable<void, CanceledEvent>((resolve, reject, receive) => {
							let timeout = null;
							(new Promise((resolve, reject) => {
								timeout = setTimeout(resolve, 500)
								receive(interrupt => {
									if (interrupt instanceof CanceledEvent) {
										if (timeout !== null) clearTimeout(timeout)
										reject(interrupt)
									}
								})
							})).then(() => {
								menuCancelable.interrupt(new CanceledEvent('Timeout After De-focus'))
								timeout = null
								clear_menu(otherKey)
								clear_canceled(otherKey)
								resolve(undefined)
							}).catch((reason) => {
								clear_canceled(otherKey)
								reject(reason)
							})
						})
						cancelable.catch(e => { if (!(e instanceof CanceledEvent)) throw e })
						return [otherKey,cancelable]
					})
				)
			})
		} else {
			canceledMenus[key].interrupt(new CanceledEvent('Re-enter Branch While Open'))
			const { [key]: _, ...newCanceledMenus } = canceledMenus
			setCanceledMenus({ ...newCanceledMenus })
		}
	}
	const handleItemGoto: ContextIntercept = action => {
		const key = action.data.ContextMenu_key as string
		if (openMenus[key]) {
			if (canceledMenus[key]) {
				canceledMenus[key].interrupt(new CanceledEvent('Re-focus Branch While Open'))
				const { [key]: _, ...newCanceledMenus } = canceledMenus
				setCanceledMenus({ ...newCanceledMenus })
			}
			openMenus[key].interrupt(new FocusEvent('Focus menu'))
		} else {
			const menu = open_branch(action)
			menu.interrupt(new FocusEvent('Focus menu'))
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
				'ContextMenuItem.focus': handleItemFocus,
				'ContextMenuItem.goto': handleItemGoto,
				...intercept,
			}}
			root
		>
			{menu.map(menuItem => renderMenuItem(menuItem, contextSystem, openMenus))}
		</Context>
	)
}

ContextMenu.title = 'ContextMenu'

export default ContextMenu
