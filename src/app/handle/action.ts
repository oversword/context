import evaluateCondition from '../conditions/evaluate-condition';
import evaluateDisabled from '../conditions/evaluate-disabled';
import {
  StoreMeta,
  ContextAction,
  ContextActionName,
  ContextData,
  ContextDataGenerator,
  ContextEvent,
  ContextIntercept,
  ContextId,
  StoreMetaList,
} from '../types/index.types';
import contextsExtractType from '../transformers/contexts-extract-type';
import contextsExtractPath from '../transformers/contexts-extract-path';
import contextsDecideData from '../transformers/contexts-decide-data';
import contextsDecideActs from '../transformers/contexts-decide-acts';
import PartialOmit from '../types/partial-omit';
import getIntercept from './intercept';
import { ActionDefinition } from '../types/intercept.types';
import { inactiveLog as log } from '../utils/debug-log';
import { ContextSystemApi } from '../types/system.types';
import { HANDLED, UNHANDLED } from '../constants/handled';

// TODO: Why was this required?
// let curryHandle = Promise.resolve();
// let currentlyHandling = false;
// const actionHandle = (
//   method: ContextInterceptCallback,
//   action: ContextAction,
//   event: ContextEvent,
// ): Promise<void> => {
//   console.log(action, currentlyHandling)
//   if (currentlyHandling) {
//     const persistentEvent = { ...event };
//     curryHandle = curryHandle.then(async () => {
//       currentlyHandling = true;
//       const result = await method(action, persistentEvent);
//       currentlyHandling = false;
//       return result;
//     });
//     return curryHandle;
//   }
//   currentlyHandling = true;
//   curryHandle = Promise.resolve(method(action, event));
//   curryHandle.then(() => {
//     currentlyHandling = false;
//   });
//   return curryHandle;
// };

function executeActionMethod(
  contextSystemApi: ContextSystemApi,
  intercept: ActionDefinition | ContextIntercept,
  action: ContextAction,
): Promise<unknown> {
  if ('action' in intercept)
    return Promise.resolve(
      contextTriggerAction(
        contextSystemApi,
        intercept.id,
        intercept.action,
        action.event,
        action.data,
      ),
    );
  /* NOTE: Intercept is a user-provided method, Side-effects may occur here. */
  return Promise.resolve(intercept(action));
}

const contextHandleAction = (
  contextSystemApi: ContextSystemApi,
  contexts: StoreMetaList,
  action: ContextActionName,
  event: ContextEvent,
  overrideData?: ContextData | ContextDataGenerator,
): Symbol | Promise<unknown> => {
  log('handling action:', { contexts, action, event, overrideData });

  const type = contextsExtractType(contexts);
  const path = contextsExtractPath(contexts);

  const data = contextsDecideData([{ config: { data: overrideData } } as StoreMeta, ...contexts], {
    action,
    path,
    type,
    event,
  });

  const interceptGetter = getIntercept(contexts, { action, type, data, event });

  const outercept = interceptGetter('outercept');
  if (outercept)
    return executeActionMethod(contextSystemApi, outercept, { action, path, type, data, event });

  const intercept = interceptGetter('intercept');
  if (intercept)
    return executeActionMethod(contextSystemApi, intercept, { action, path, type, data, event });

  return UNHANDLED;
};

export const handleNamedAction = (
  contextSystemApi: ContextSystemApi,
  contexts: StoreMetaList,
  action: string | null,
  actionObj: PartialOmit<ContextAction, 'action'>,
): Symbol | Promise<unknown> => {
  log('handling named action:', { contexts, action, actionObj });
  if (!action) return UNHANDLED;
  if (typeof action !== 'string') return UNHANDLED;

  const acts = contextsDecideActs(contexts, { action, ...actionObj });
  const act = acts[action];
  if (!evaluateCondition(act, { action, ...actionObj })) {
    return UNHANDLED;
  }
  if (evaluateDisabled(act, { action, ...actionObj })) {
    log(`${action} action not triggered for ${actionObj.type} because action is disabled`);
    return HANDLED;
  }

  return contextHandleAction(contextSystemApi, contexts, action, actionObj.event, actionObj.data);
};

export const contextTriggerAction = (
  contextSystemApi: ContextSystemApi,
  id: ContextId,
  action: ContextActionName,
  event: ContextEvent,
  overrideData?: ContextData | ContextDataGenerator,
): Symbol | Promise<unknown> => {
  log('triggering action:', { id, action, event, overrideData });
  const contexts = contextSystemApi.getContexts(id);

  const type = contextsExtractType(contexts);
  const path = contextsExtractPath(contexts);
  const data = contextsDecideData([{ config: { data: overrideData } } as StoreMeta, ...contexts], {
    action,
    path,
    type,
    event,
  });
  return handleNamedAction(contextSystemApi, contexts, action, { path, data, type, event });
};
