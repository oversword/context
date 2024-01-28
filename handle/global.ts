import { ContextKeyEvent } from '../types/index.types';
import contextsType from '../transformers/contexts-type';
import contextsPath from '../transformers/contexts-path';
import contextsData from '../transformers/contexts-data';
import contextsKeysAction from '../transformers/contexts-keys-action';
import { handleNamedAction, UNHANDLED } from './action';
import { inactiveLog as log } from '../utils/debug-log';
import { ContextSystemApi } from '../types/system.types';

const contextHandleGlobalEvent = (
  contextSystemApi: ContextSystemApi,
  event: ContextKeyEvent,
): Symbol | Promise<unknown> => {
  log('hadling global event', event);
  const allContexts = contextSystemApi.getContexts(contextSystemApi.focussedContext);

  for (let c = 0; c < allContexts.length; c++) {
    const contexts = allContexts.slice(c);
    const { id } = contexts[0];
    log('hadling global event contexts', { id, contexts });

    const type = contextsType(contexts);
    const path = contextsPath(contexts);
    const data = contextsData(contexts, { path, type, event });

    const combinationAction = contextsKeysAction(contexts, { path, type, data, event });
    log('hadling global event combinationAction', { id, combinationAction });

    const inputHandled = handleNamedAction(contextSystemApi, contexts, 'input', {
      path,
      type,
      data,
      event: {
        ...event,
        combinationAction,
      },
    });
    if (inputHandled !== UNHANDLED) return inputHandled;

    if (combinationAction) {
      const combinationHandled = handleNamedAction(contextSystemApi, contexts, combinationAction, {
        path,
        type,
        data,
        event,
      });
      if (combinationHandled !== UNHANDLED) return combinationHandled;
    }
  }
  return UNHANDLED;
};

export default contextHandleGlobalEvent;
