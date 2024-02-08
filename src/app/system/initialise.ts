import bindEvent from '../side-effects/bind-event';
import {
  ContextId,
  StoreMetaGroup,
  ContextConfig,
  ContextDataGenerator,
  ContextData,
  ContextInterceptGroup,
  StoreMetaList,
  ContextMenuItemListFilled,
  ContextEvent,
  ContextActionName,
  ContextActionNameConfig,
  ContextKeyList,
} from '../types/index.types';
import contextsExtractType from '../../contexts/transformers/extract-type';
import contextsExtractPath from '../../contexts/transformers/extract-path';
import contextsDecideData from '../../contexts/transformers/decide-data';
import contextsDecideActs from '../../contexts/transformers/decide-acts';
import contextsMenu from '../../contexts/transformers/decide-menu';
import contextsDecideKeys from '../../contexts/transformers/decide-keys';
import menuApplyKeys from '../transformers/menu-apply-keys';
import menuApplyConditions from '../transformers/menu-apply-conditions';
import CONTEXT_CLASS from '../constants/context-class';
import { contextTriggerAction } from '../handle/action';
import contextHandleGlobalEvent from '../handle/global';
import contextHandleLocalEvent from '../handle/local';
import provideEnvironment from './render-environment';
import { inactiveLog as log } from '../utils/debug-log';
import keyDown from '../dom-events/key-down';
import keyUp from '../dom-events/key-up';
import click from '../dom-events/click';
import doubleClick from '../dom-events/double-click';
import mouseDown from '../dom-events/mouse-down';
import mouseUp from '../dom-events/mouse-up';
import { EventHandler, EVENT_NAMES } from '../types/dom-events.types';
import { ContextSystemApi } from '../types/system.types';
import { UNHANDLED } from '../constants/handled';

const initialiseContextSystem = (rootElement: HTMLElement): ContextSystemApi => {
  let focussedContext: ContextId | null = null;
  let _contextId: number = 0;
  const contextMetas: StoreMetaGroup = {};

  const getContexts = (id: ContextId | null): StoreMetaList => {
    if (!id) return [];

    const context = contextMetas[id];
    if (!context) return [];

    const { root, parent } = context;
    if (root || !parent) return [context];

    return [context, ...getContexts(parent)];
  };
  const removeContext = (contextId: ContextId): void => {
    contextMetas[contextId] = undefined; // { id, parent }
  };
  const addContext = ({
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
  }): void => {
    contextMetas[id] = {
      id,
      parent,
      root,
      config: data
        ? {
            ...(context || {}),
            moreData: data,
          }
        : context || {},
      intercept,
      outercept,
    };
  };

  const decideMenuConfig = (id: ContextId, event: ContextEvent): ContextMenuItemListFilled => {
    const contexts = getContexts(id);

    const type = contextsExtractType(contexts);
    const path = contextsExtractPath(contexts);
    const data = contextsDecideData(contexts, { path, type, event });
    const menu = contextsMenu(contexts, { path, type, data, event });
    const acts = contextsDecideActs(contexts, { path, type, data, event });
    const keys = contextsDecideKeys(contexts, { path, type, data, event });

    return menuApplyKeys(menuApplyConditions(menu, acts, { path, type, data, event }), keys, {
      path,
      type,
      data,
      event,
    });
  };

  const isFocus = (id: ContextId, event: Event): boolean => {
    const focus = (event.target as HTMLElement).closest<HTMLElement>(`.${CONTEXT_CLASS}`);
    return id === focus?.dataset.contextid;
  };

  /**
   * Trigger named actions from a specific context
   * @param id
   * @returns
   */
  const triggerAction =
    (id: ContextId) =>
    (
      action: ContextActionName,
      event: ContextEvent,
      data?: ContextData | ContextDataGenerator,
    ): Symbol | Promise<unknown> => {
      log('trigger action API', { id, action, event, data });
      if (!action) throw new Error(`Action must be provided`);
      if (typeof action !== 'string') throw new Error(`Action must be a string`);

      return contextTriggerAction(contextSystemApi, id, action, event, data);
    };

  /**
   * Handle events triggered by local listeners
   * @param id
   * @param onAction
   * @returns
   */
  const handleLocalEvent =
    (id: ContextId, onAction: ContextActionNameConfig) =>
    (event: Event): false | void => {
      log('handle local event API', { id, onAction, event });
      const handled = contextHandleLocalEvent(contextSystemApi, id, onAction, event);
      if (handled === UNHANDLED) return undefined;
      event.preventDefault();
      return false;
    };

  const currentKeys: Record<string, boolean> = {};

  const setKey = (key: string, active: boolean): void => {
    currentKeys[key] = active;
  };

  const getCombination = (): ContextKeyList =>
    Object.entries(currentKeys)
      .filter(([, val]) => val)
      .map(([key]) => key);

  /**
   * Handle events triggered by the global listeners
   *
   * @param handleConfig A config determining the handling process
   * @returns
   */
  const handleGlobalEvent: EventHandler = handleConfig => event => {
    let ret: undefined | false;
    if (handleConfig.before) {
      const keySet = handleConfig.before(event);
      if (keySet)
        Object.entries(keySet).forEach(([key, active]) => {
          setKey(key, active);
        });
    }
    if (handleConfig.keyInfo) {
      const keyInfo = handleConfig.keyInfo(event);
      if (keyInfo) {
        const handled = contextHandleGlobalEvent(contextSystemApi, {
          ...keyInfo,
          combination: getCombination(),
          target: event.target,
        });
        if (handled !== UNHANDLED) {
          event.preventDefault();
          ret = false;
        }
      }
    }
    if (handleConfig.after) {
      const keySet = handleConfig.after(event);
      if (keySet)
        Object.entries(keySet).forEach(([key, active]) => {
          setKey(key, active);
        });
    }
    return ret;
  };

  bindEvent(rootElement, EVENT_NAMES.KEY_DOWN, handleGlobalEvent(keyDown));
  bindEvent(rootElement, EVENT_NAMES.KEY_UP, handleGlobalEvent(keyUp));

  bindEvent(rootElement, EVENT_NAMES.MOUSE_UP, handleGlobalEvent(mouseUp));
  bindEvent(rootElement, EVENT_NAMES.MOUSE_DOWN, handleGlobalEvent(mouseDown));

  bindEvent(rootElement, EVENT_NAMES.CLICK, handleGlobalEvent(click));
  bindEvent(rootElement, EVENT_NAMES.DOUBLE_CLICK, handleGlobalEvent(doubleClick));

  const environment = provideEnvironment(rootElement);

  const contextSystemApi: ContextSystemApi = {
    set focussedContext(newFocussedContext: ContextId | null) {
      focussedContext = newFocussedContext;
    },
    get focussedContext(): ContextId | null {
      return focussedContext;
    },
    newId: (): ContextId => String(++_contextId),
    addContext,
    removeContext,
    getContexts,
    decideMenuConfig,
    isFocus,
    triggerAction,
    handleLocalEvent,
    contextMenu: (pos, menu, level = 0) =>
      environment.render(contextSystemApi, { pos, menu, level }),
  };

  return contextSystemApi;
};
export default initialiseContextSystem;
