import PartialOmit from '../utils/partial-omit';
import {
  ContextId,
  StoreMetaList,
  ContextEvent,
  ContextMenuItemListFilled,
  ContextConfig,
  ContextData,
  ContextDataGenerator,
  ContextInterceptGroup,
  ContextActionName,
  ContextActionNameConfig,
} from './index.types';

export interface ContextMenuResult {
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
  menu: ContextMenuItemListFilled;
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
  decideMenuConfig: (id: ContextId, event: ContextEvent) => ContextMenuItemListFilled;
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

  contextMenu: (
    pos: ContextMenuOptionsPosition,
    menu: ContextMenuItemListFilled,
    level?: number,
  ) => Promise<ContextMenuResult | null>;

  triggerAction: (
    id: ContextId,
  ) => (
    action: ContextActionName,
    event: ContextEvent,
    overrideData?: ContextData | ContextDataGenerator,
  ) => Symbol | Promise<unknown>;
  handleLocalEvent: (
    id: ContextId,
    onAction: ContextActionNameConfig,
  ) => (event: Event) => false | void;
}
