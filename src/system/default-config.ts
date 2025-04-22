import BranchIcon from '@/components/BranchIcon'
import classes from '@/components/ContextMenu/classes'
import itemClasses from '@/components/ContextMenuItem/classes'
import { MENU_ITEM_ID, MENU_ITEM_PARENT } from '@/constants/menu-item'
import { ContextMenuItemList, ContextMenuItemMode, ContextParentMenuMeta } from '@/types/index.types'
import { ContextSystemConfig } from '@/types/system.types'
import { css } from '@emotion/react'
import React from 'react'

const getParentMenu = (parentInfo: ContextParentMenuMeta): ContextMenuItemList => {
	if (parentInfo && parentInfo.menu.length) {
		if (parentInfo.menu.length === 1 && parentInfo.menu[0][MENU_ITEM_PARENT]) {
			return parentInfo.menu
		} else {
			return [{
				id: `parent-section-${parentInfo[MENU_ITEM_ID]}`,
				mode: ContextMenuItemMode.section,
				label: parentInfo.label,
				children: parentInfo.menu,
				[MENU_ITEM_ID]: parentInfo[MENU_ITEM_ID],
				[MENU_ITEM_PARENT]: true
			}]
		}
	}
	return []
}
const defaultConfiguration: ContextSystemConfig = {
	strategy_mergeMenu: (staticMenu) => (_action, current, parentInfo) => {
		const cleanCurrent = current.filter(item => !(
			item[MENU_ITEM_PARENT] &&
			item[MENU_ITEM_ID] === parentInfo[MENU_ITEM_ID]
		))
		const merged = [
			...staticMenu,
			...cleanCurrent,
		]
		if (merged.length === 1 && merged[0][MENU_ITEM_PARENT])
			return merged

		return [
			...merged,
			...getParentMenu(parentInfo),
		]
	},
	strategy_mergeActs: (staticActs) => (_action, current) => Object.entries(staticActs).reduce((current, [actionName, options]) => ({
		...current,
		[actionName]: {
			...(current[actionName] || {}),
			...options,
		}
	}), current),
	strategy_mergeData: (staticData) => (_action, current) => Object.assign({}, current, staticData),
	branchIcon: React.createElement(BranchIcon),
	structure: {
		[`.${classes.ContextMenu}`]: css`
			user-select: none;
		`,
		[`.${classes.ContextMenuSection}`]: css`
			border-top: 1px solid;
			display: block;
		`,
		[`.${classes.ContextMenuSectionLabel}`]: css`
			white-space: nowrap;
		`,
		[`.${itemClasses.ContextMenuItem}`]: css`
			display: flex;
			justify-content: space-between;
			cursor: pointer;
		`,
		[`.${itemClasses.ContextMenuItemKeys}`]: css`
			white-space: nowrap;
		`,
		[`.${itemClasses.ContextMenuItemContent}`]: css`display: flex;`,
		[`.${itemClasses.ContextMenuItemLabel}`]: css`white-space: nowrap;`,
		[`.${itemClasses.ContextMenuItemIconEmpty}`]: css`display: none;`,
		[`.${classes.ContextMenu} svg`]: css`
			display: inline-block;
			vertical-align: bottom;
		`
	},
	color: {
		[`.${classes.ContextMenu}`]: css`
			font-family: sans-serif;
			background: #fff;
			color: #111;
			box-shadow: 0 3px 9px -2px rgba(0, 0, 0, 0.5);
		`,
		[`.${classes.ContextMenuSection}`]: css`
			&:first-of-type {
				border-top: none;
			}
		`,
		[`.${classes.ContextMenuSectionLabel}`]: css`
			color: #888;
		`,
		[`.${itemClasses.ContextMenuItem}`]: css`
			border-top: 1px solid #eee;
			&:first-of-type {
				border-top: none;
			}
			&.${itemClasses.ContextMenuItemDisabled} {
				color: #bbb;
			}
			&:not(.${itemClasses.ContextMenuItemDisabled}):hover {
				background: #aaf;
			}
			&:not(.${itemClasses.ContextMenuItemDisabled}):focus {
				background: #44d;
				color: #fff;
			}
		`,
		[`.${itemClasses.ContextMenuItemKeys}`]: css`
			color: #999;
		`,
	},
	size: {
		[`.${classes.ContextMenu}`]: css`
			font-size: 14px;
			border-radius: 3px;
		`,
		[`.${classes.ContextMenuSection}`]: css`
			padding: 0;
		`,
		[`.${classes.ContextMenuSectionLabel}`]: css`
			padding: 0.5em 1em;
			font-size: 0.9em;
		`,
		[`.${itemClasses.ContextMenuItem}`]: css`
			column-gap: 1em;
			padding: 0.5em 1em;
		`,
		[`.${itemClasses.ContextMenuItemKeys}`]: css`
			font-size: 0.8em;
			padding-top: 0.125em;
		`,
		[`.${itemClasses.ContextMenuItemIcon}`]: css`
			width: 1em;
			height: 1em;
			margin-right: 0.5em;
		`,
		[`.${classes.ContextMenu} svg`]: css`
			font-size: 1em;
		`
	},
}
export default defaultConfiguration