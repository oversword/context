import { Root } from 'react-dom/client';
import { ContextMenuRenderer } from './system.types';

export interface Environment {
  menus: EnvironmentMenus;
  container: HTMLElement;
}

export interface EnvironmentMenu {
  level: number;
  container: HTMLElement;
  reactRoot: Root;
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
  render: ContextMenuRenderer;
}
