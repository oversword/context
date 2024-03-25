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
} from './index.types'

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
	pos: ContextMenuOptionsPosition;
	menu: ContextActMenuItemList;
	level?: number;
}

export type ContextMenuRenderer = (
	contextSystemApi: ContextSystemApi,
	opts: ContextMenuOptions,
) => Promise<ContextMenuResult | null>;

export interface ContextSystemApi {
	focussedContext: ContextId | null;
	newId: () => ContextId;
	getContexts: (id: ContextId | null) => StoreMetaList;
	// decideMenuConfig: (id: ContextId, event: ContextEvent) => ContextMetaMenuItemList;
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

	addMenu: (
		pos: ContextMenuOptionsPosition,
		menu: ContextActMenuItemList,
		level?: number,
	) => Promise<ContextMenuResult | null>;
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
	) => (event: Event) => false | void;
}
