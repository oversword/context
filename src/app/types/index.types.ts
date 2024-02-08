import PartialOmit from './partial-omit';
import {ReactElement} from 'react'
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
  disabled?: boolean | ContextCondition<PartialOmit<ContextAction, 'action'>>;
  condition?: boolean | ContextCondition<PartialOmit<ContextAction, 'action'>>;
}

export interface ContextActionNameObject {
  condition: ContextCondition<PartialOmit<ContextAction, 'action'>>;
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

export type ContextEvent = ContextKeyEvent | {} | undefined | Event;

export type ContextIntercept = (action: ContextAction) => void | Symbol | Promise<unknown>;

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
export interface ContextMenuItemFilled extends PartialOmit<BasicContextMenuItem, 'action'> {
  keys?: ContextKeyList;
  disabled?: boolean;
  children?: ContextMenuItemListFilled;
  mode?: ContextMenuItemMode;
}

/**
 * Lists & Groups
 */

export type ContextTypeList = Array<ContextType>;
export type ContextKeyList = Array<ContextKey>;
export type ContextMenuItemListFilled = Array<ContextMenuItemFilled>;
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
) => ContextMenuItemList;

/**
 * INPUT
 */
export interface ContextConfig {
  type?: ContextType;
  acts?: ContextActGroupGroup;
  data?: ContextData | ContextDataGenerator;
  menu?: ContextMenuListGroup;
  keys?: ContextKeyListGroup;
}
export interface DataContextProps {
  children: null | ReactElement | Array<ReactElement>;
  DataContext?: ContextConfig | null;
  context?: ContextConfig | null;
  data?: ContextData | ContextDataGenerator | null;
  intercept?: ContextInterceptGroup | null;
  outercept?: ContextInterceptGroup | null;
  root?: boolean;
}

export interface ContextProps extends Omit<DataContextProps, 'DataContext'> {
  Context?: ContextConfig | null;
  focus?: boolean;
  onFocus?: ((event?: FocusEvent) => void) | null;
  element?: /* React.FunctionComponent | */ string | null;
  tabIndex?: number;
  onClickAction?: ContextActionNameConfig | null;
  onDoubleClickAction?: ContextActionNameConfig | null;
  onMouseDownAction?: ContextActionNameConfig | null;
  onMouseUpAction?: ContextActionNameConfig | null;
  onMouseMoveAction?: ContextActionNameConfig | null;
  onChangeAction?: ContextActionNameConfig | null;
  [attr: string]: unknown;
}

export type ContextKeyListGroup = Record<ContextActionName, ContextKeyList>;
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
export interface StoreContext extends ContextConfig {
  moreData?: ContextData | ContextDataGenerator;
}

export interface StoreMeta {
  id: ContextId;
  root: boolean;
  parent: ContextId | null;
  intercept: ContextInterceptGroup | null;
  outercept: ContextInterceptGroup | null;
  config: StoreContext;
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
  ) => Symbol | Promise<unknown>;
  triggerAction?: (
    action: ContextActionName,
    event?: ContextEvent,
    data?: ContextData | ContextDataGenerator,
  ) => Symbol | Promise<unknown>;
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
