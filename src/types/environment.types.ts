import { ContextMenuRenderer } from './system.types'

export interface Environment {
	menus: EnvironmentMenus;
	container: HTMLElement;
}

export interface EnvironmentMenu {
	id: string;
	parentId: null | string;
	level: number;
	destroy: ((shouldReject: boolean) => void);
}
export type EnvironmentMenus = Array<EnvironmentMenu>;

export interface EnvironmentApi {
	create: (root: HTMLElement) => void;
	delete: () => void;
	exists: () => boolean;
	menus: EnvironmentMenus;
	container: HTMLElement | null;
	root: HTMLElement;
	cancel: (event: Event) => void;
	addMenu: ContextMenuRenderer;
}
