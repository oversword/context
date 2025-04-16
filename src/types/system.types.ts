import PartialOmit from './partial-omit'
import {
	ContextId,
	StoreMetaList,
	ContextEvent,
	ContextConfig,
	ContextData,
	ContextDataGenerator,
	ContextInterceptGroup,
	ContextActionName,
	ContextActionNameConfig,
	ContextActMenuItemList,
	ContextMenuItemList,
	ContextMenuListGenerator,
	ContextActsGroup,
	ContextActsGroupGenerator,
} from './index.types'
import { Interpolation, Theme } from '@emotion/react'
import Interruptable from '@/generic/promise/classes/interruptable'


export interface ContextSystemConfig {
	strategy_mergeMenu: (staticMenu: ContextMenuItemList) => ContextMenuListGenerator,
	strategy_mergeActs: (staticActs: ContextActsGroup) => ContextActsGroupGenerator,
	strategy_mergeData: (staticData: ContextData) => ContextDataGenerator,
	structure: Interpolation<Theme>;
	color: Interpolation<Theme>;
	size: Interpolation<Theme>;
	branchIcon: React.ReactElement
}
export interface ContextMenuResult {
	id: ContextId;
	data: ContextData;
	action: ContextActionName;
}
export interface ContextMenuOptionsBounds {
	x: number;
	y: number;
	w: number;
	h: number;
}
export type ContextMenuOptionsPosition = PartialOmit<ContextMenuOptionsBounds, 'w' | 'h'>;
export type ContextMenuOptionsSize = PartialOmit<ContextMenuOptionsBounds, 'x' | 'y'>;

export interface ContextMenuOptions {
	id: string;
	parent?: string | null;
	pos: ContextMenuOptionsPosition;
	menu: ContextActMenuItemList;
	level?: number;
}

export class CanceledEvent extends Event {}
export class ClosedEvent extends Event {}
export class DestroyedEvent extends CanceledEvent {}
export type ContextMenuRendererInterrupt = CanceledEvent | FocusEvent
export type ContxtMenuRendererInterruptable = Interruptable<ContextMenuResult | null, ContextMenuRendererInterrupt>
export type ContextMenuRenderer = (
	contextSystemApi: ContextSystemApi,
	opts: ContextMenuOptions,
) => ContxtMenuRendererInterruptable;

export interface ContextSystemApi {
	focussedContext: ContextId | null;
	configuration: ContextSystemConfig;
	newId: () => ContextId;
	getContexts: (id: ContextId | null) => StoreMetaList;
	isFocus: (id: ContextId, event: Event) => boolean;
	addContext: ({
		id,
		intercept,
		outercept,
		parent,
		root,
		data,
		context,
	}: {
		id: ContextId;
		parent: null | ContextId;
		root: boolean;
		context: ContextConfig | null;
		data: ContextData | ContextDataGenerator | null;
		intercept: ContextInterceptGroup | null;
		outercept: ContextInterceptGroup | null;
	}) => void;
	removeContext: (contextId: ContextId) => void;

	closeMenu: (
		id: string
	) => void
	addMenu: (
		options: ContextMenuOptions
	) => ContxtMenuRendererInterruptable;
	removeMenu: () => void;
	addContextMenu: (
		id: ContextId,
		event: MouseEvent,
	) => Promise<ContextMenuResult | null>;

	triggerAction: (
		id: ContextId,
	) => (
		action: ContextActionName,
		event: ContextEvent,
		overrideData?: ContextData | ContextDataGenerator,
	) => symbol | Promise<unknown>;
	handleLocalEvent: (
		id: ContextId,
		onAction: ContextActionNameConfig,
	) => (event: ContextEvent) => false | void;
}
