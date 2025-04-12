export enum EVENT_NAMES {
	KEY_DOWN = 'keydown',
	KEY_UP = 'keyup',
	CLICK = 'click',
	DOUBLE_CLICK = 'dblclick',
	MOUSE_DOWN = 'mousedown',
	MOUSE_UP = 'mouseup',
	MOUSE_ENTER = 'mouseenter',
	MOUSE_LEAVE = 'mouseleave',
	MOUSE_OVER = 'mouseover',
	MOUSE_OUT = 'mouseout',
}
export interface EventTypes {
	[EVENT_NAMES.CLICK]: (event: MouseEvent) => false | void;
	[EVENT_NAMES.DOUBLE_CLICK]: (event: MouseEvent) => false | void;
	[EVENT_NAMES.MOUSE_UP]: (event: MouseEvent) => false | void;
	[EVENT_NAMES.MOUSE_DOWN]: (event: MouseEvent) => false | void;
	[EVENT_NAMES.KEY_DOWN]: (event: KeyboardEvent) => false | void;
	[EVENT_NAMES.KEY_UP]: (event: KeyboardEvent) => false | void;
}

export interface KeyInfo {
	pos: string;
	char: string;
	symbol: string;
}

export type KeySet = Record<string, boolean>;
export interface HandleConfig<E extends Event = Event> {
	before?: (event: E) => false | KeySet;
	keyInfo?: (event: E) => false | KeyInfo;
	after?: (event: E) => false | KeySet;
}

export type EventHandler = <E extends Event = Event>(
	handleConfig: HandleConfig<E>,
) => (event: E) => void | false;
