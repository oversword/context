import React from 'react'

import Context from '../Context'
import {
	ContextApi,
	ContextConfig,
	ContextMenuItemMode,
	ContextIntercept,
} from '../../types/index.types'
import ContextMenuItem from '../ContextMenuItem'
import DataContext from '../DataContext'
import classes from './classes'
import itemClasses from '../ContextMenuItem/classes'
import { ContextMenuProps } from './index.types'
import { getKey, getLabel } from './utils'
import SystemContext from '../../constants/system-context'
import { ContextMenuResult } from '../../types/system.types'

import useStyles from './style'

const OPEN_BRANCH = Symbol('open-branch')
const MENU_ERROR = Symbol('menu-error')

const context: ContextConfig = {
	type: 'context-menu',
	keys: { close: ['Escape'] },
	acts: {
		'context-menu': (_action, acts) => ({
			load: {},
			action: {},
			close: {},
			...acts,
		}),
	},
}

function ContextMenu({
	menu = [{ label: 'No Actions', mode: ContextMenuItemMode.section, action: '' }],
	level = 0,
	intercept = {},
	...passedProps
}: ContextMenuProps): React.ReactElement {
	const contextSystem = React.useContext(SystemContext) || null
	if (!contextSystem) {
		throw new Error('A context system must be provided via the SystemContext.Provider component.')
	}

	const contextRef = React.useRef<ContextApi>()
	React.useEffect(() => {
		if (!(contextRef.current && contextRef.current.element)) return

		contextRef.current.trigger('load')
	}, [contextRef.current && contextRef.current.element])

	const handleItemSelect: ContextIntercept = ({ event, data }) => {
		if (data.ContextMenuItem_action === OPEN_BRANCH) {
			const key = data.ContextMenu_key
			const item = menu.find(
				menuItem => menuItem.mode === ContextMenuItemMode.branch && getKey(menuItem) === key,
			)

			if (!item) throw new Error('Menu item does not exist')
			if (!item.children) throw new Error('Menu item has no children to open')
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
				.contextMenu(pos, item.children, level + 1)
				.catch(() => ({}) as ContextMenuResult)
				.then(result => {
					if (!result) return
					const { action, data } = result
					if (!action) return
					contextRef.current?.trigger('action', event, {
						ContextMenu_action: action,
						ContextMenu_data: data,
					})
				})
		} else {
			contextRef.current?.trigger('action', event, {
				ContextMenu_action: data.ContextMenuItem_action,
				ContextMenu_data: data.ContextMenuItem_data,
			})
		}
	}
	const styles = useStyles()

	return (
		<Context
			className={styles[classes.ContextMenu]}
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
			{menu.map(menuItem => {
				switch (menuItem.mode) {
				case ContextMenuItemMode.section: {
					return (
						<div className={styles[classes.ContextMenuSection]} key={getKey(menuItem)}>
							{getLabel(menuItem) ? (
								<div className={styles[classes.ContextMenuSectionLabel]}>{getLabel(menuItem)}</div>
							) : null}
							{(menuItem.children || []).map(childItem => (
								<DataContext
									data={{
										ContextMenu_key: getKey(childItem),
									}}
									key={getKey(childItem)}
								>
									<ContextMenuItem
										label={getLabel(childItem)}
										action={childItem.action || MENU_ERROR}
										data={childItem.data}
										disabled={childItem.disabled}
										keys={childItem.keys}
									/>
								</DataContext>
							))}
						</div>
					)
				}
				case ContextMenuItemMode.branch: {
					return (
						<DataContext
							data={{
								ContextMenu_key: getKey(menuItem),
							}}
							key={getKey(menuItem)}
						>
							<ContextMenuItem
								label={`${getLabel(menuItem)}...`}
								action={OPEN_BRANCH}
								disabled={menuItem.disabled}
							/>
						</DataContext>
					)
				}
				default:
					return (
						<DataContext
							data={{
								ContextMenu_key: getKey(menuItem),
							}}
							key={getKey(menuItem)}
						>
							<ContextMenuItem
								label={getLabel(menuItem)}
								action={menuItem.action || MENU_ERROR}
								data={menuItem.data}
								disabled={menuItem.disabled}
								keys={menuItem.keys}
							/>
						</DataContext>
					)
				}
			})}
		</Context>
	)
}

ContextMenu.title = 'ContextMenu'

export default ContextMenu
