import React from 'react'

import { MENU_ITEM_ID, MENU_ITEM_PARENT } from '@/constants/menu-item'
import PartialOmit from './partial-omit'
/**
 * Atomic
 */
export type ContextId = string; // 'CONTEXT_ID';
export type ContextType = string; // 'CONTEXT_TYPE';
export type ContextSelector = string; // 'CONTEXT_SELECTOR';
export type ContextActionName = string; // 'CONTEXT_ACTION_NAME';
export type ContextKey = string; // 'CONTEXT_KEY'

export type ContextData = Record<string, unknown>;

export type ContextCondition<A extends Partial<ContextAction> = ContextAction> = (
	action: A,
) => boolean;
export interface ContextAct {
	keys?: ContextKeyList;
	disabled?: boolean | ContextCondition<PartialOmit<ContextAction, 'action'>>;
	condition?: boolean | ContextCondition<PartialOmit<ContextAction, 'action'>>;
}

export interface ContextActionNameObject {
	condition: boolean | ContextCondition<PartialOmit<ContextAction, 'action'>>;
	action: ContextActionName | ContextActionNameGenerator;
}

export interface ContextInterceptObject {
	condition: ContextCondition;
	method: ContextIntercept;
}
export interface ContextAction {
	action: ContextActionName;
	event: ContextEvent;
	type: ContextType;
	path: ContextTypeList;
	data: ContextData;
}

export type ContextEvent = ContextKeyEvent | object | undefined | Event;

export type ContextIntercept = (action: ContextAction) => void | symbol | Promise<unknown>;

export enum ContextMenuItemMode {
	section = 'section',
	branch = 'branch',
}
export interface BasicContextMenuItem {
	key?: string;
	id?: string;
	title?: string;
	label: string;

	action: ContextActionName;
	data?: ContextData | ContextDataGenerator;

	[MENU_ITEM_ID]?: string;
	[MENU_ITEM_PARENT]?: true;
}
export interface BranchContextMenuItem extends Omit<BasicContextMenuItem, 'action'> {
	children: ContextMenuItemList;
	mode: ContextMenuItemMode.branch;
}
export interface SectionContextMenuItem extends Omit<BasicContextMenuItem, 'action'> {
	children: ContextMenuItemList;
	mode: ContextMenuItemMode.section;
}

export type ContextMenuItem = BasicContextMenuItem | BranchContextMenuItem | SectionContextMenuItem;

export interface ContextParentMenuMeta {
	label: string,
	type: ContextType,
	menu: ContextActMenuItemList
	[MENU_ITEM_ID]: string;
}

type ActMenuItem<T extends ContextMenuItem> = T & {
	keys: Array<string>;
	disabled: boolean;
}
type ActMenuItem_with_Children<T extends ContextMenuItem> = Omit<ActMenuItem<T>, 'children'> & {
	children: ContextActMenuItemList;
}
export type BasicContextActMenuItem = ActMenuItem<BasicContextMenuItem>
export type BranchContextActMenuItem = ActMenuItem_with_Children<BranchContextMenuItem>
export type SectionContextActMenuItem = ActMenuItem_with_Children<SectionContextMenuItem>

export type ContextActMenuItem = BasicContextActMenuItem | BranchContextActMenuItem | SectionContextActMenuItem;

/**
 * Lists & Groups
 */

export type ContextTypeList = Array<ContextType>;
export type ContextKeyList = Array<ContextKey>;
export type ContextActMenuItemList = Array<ContextActMenuItem>;
export type ContextMenuItemList = Array<ContextMenuItem>;
export type ContextActsGroup = Record<ContextActionName, ContextAct>;

/**
 * Generators
 */
export type ContextActionNameGenerator = (
	action: PartialOmit<ContextAction, 'action'>,
) => ContextActionName;

export type ContextDataGenerator = (
	action: PartialOmit<ContextAction, 'data' | 'action'>,
	current: ContextData,
) => ContextData;

export type ContextActsGroupGenerator = (
	action: PartialOmit<ContextAction, 'action'>,
	current: ContextActsGroup,
) => ContextActsGroup;

export type ContextMenuListGenerator = (
	action: PartialOmit<ContextAction, 'action'>,
	current: ContextMenuItemList,
	parent: ContextParentMenuMeta,
) => ContextMenuItemList;

/**
 * INPUT
 */
export interface ContextConfig {
	type?: ContextType;
	acts?: ContextActsGroup | ContextActsGroupGenerator;
	menu?: ContextMenuItemList | ContextMenuListGenerator | false;
	data?: ContextData | ContextDataGenerator;
	label?: string;
	overrides?: Record<ContextSelector, ContextOverride>
}
export type ContextOverride = Omit<ContextConfig, 'type' | 'overrides' | 'label'>

export interface DataContextProps {
	DataContext?: ContextConfig | null;
	context?: ContextConfig | null;
	data?: ContextData | ContextDataGenerator | null;
	intercept?: ContextInterceptGroup | null;
	outercept?: ContextInterceptGroup | null;
	root?: boolean;
	ref?: React.Ref<ContextApi>
}

export interface ContextProps<P> extends Omit<DataContextProps, 'DataContext'> {
	Context?: ContextConfig | null;
	focus?: boolean;
	onFocus?: ((event?: FocusEvent) => void) | null;
	tabIndex?: number;
	onClickAction?: ContextActionNameConfig | null;
	onDoubleClickAction?: ContextActionNameConfig | null;
	onMouseDownAction?: ContextActionNameConfig | null;
	onMouseUpAction?: ContextActionNameConfig | null;
	onMouseMoveAction?: ContextActionNameConfig | null;
	onChangeAction?: ContextActionNameConfig | null;
	element?: React.FunctionComponent<P> | string | null;
	[attr: string]: unknown;
}

// export type ContextKeyListGroup = Record<ContextActionName, ContextKeyList>;
export type ContextMenuListGroup = Record<
	ContextSelector,
	ContextMenuItemList | ContextMenuListGenerator
>;
export type ContextActGroupGroup = Record<
	ContextSelector,
	ContextActsGroup | ContextActsGroupGenerator
>;
export type ContextInterceptGroup = Record<ContextSelector, ContextInterceptConfig>;

export type ContextInterceptConfig =
	| ContextIntercept
	| ContextInterceptObject
	| ContextActionName
	| ContextActionNameObject;

export type ContextActionNameConfig =
	| ContextActionName
	| ContextActionNameGenerator
	| ContextActionNameObject;

/**
 * STORE
 */

export interface StoreMeta {
	id: ContextId;
	root: boolean;
	parent: ContextId | null;
	intercept: ContextInterceptGroup | null;
	outercept: ContextInterceptGroup | null;
	data: ContextData | ContextDataGenerator | null,
	config: ContextConfig;
}

export type StoreMetaList = Array<StoreMeta>;

export type StoreMetaGroup = Record<ContextId, StoreMeta | undefined>;

/**
 * USAGE
 */
export interface ContextApi {
	element?: HTMLElement;
	trigger: (
		action: ContextActionName,
		event?: ContextEvent,
		data?: ContextData | ContextDataGenerator,
	) => symbol | Promise<unknown>;
	triggerAction?: (
		action: ContextActionName,
		event?: ContextEvent,
		data?: ContextData | ContextDataGenerator,
	) => symbol | Promise<unknown>;
}

export interface KeyInfo {
	pos: string;
	char: string;
	symbol: string;
}

export interface ContextKeyEvent extends KeyInfo {
	combination: ContextKeyList;
	target: EventTarget | null;
}
