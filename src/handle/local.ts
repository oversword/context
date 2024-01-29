import evaluateCondition from '../transformers/evaluate-condition';
import evaluateAction from '../transformers/evaluate-action';
import {
  ContextAction,
  ContextActionName,
  ContextEvent,
  ContextId,
  ContextActionNameConfig,
} from '../types/index.types';
import contextsType from '../transformers/contexts-type';
import contextsPath from '../transformers/contexts-path';
import contextsData from '../transformers/contexts-data';
import { handleNamedAction } from './action';
import PartialOmit from '../utils/partial-omit';
import { inactiveLog as log } from '../utils/debug-log';
import { ContextSystemApi } from '../types/system.types';

const getActionName = (
  onAction: ContextActionNameConfig,
  action: PartialOmit<ContextAction, 'action'>,
): ContextActionName | null => {
  if (typeof onAction === 'string') return onAction;

  if ('condition' in onAction && !evaluateCondition(onAction, action)) return null;

  return evaluateAction(onAction, action);
};

const contextHandleLocalEvent = (
  contextSystemApi: ContextSystemApi,
  id: ContextId,
  onAction: ContextActionNameConfig,
  event: ContextEvent,
): Symbol | false | Promise<unknown> => {
  log('handle local event');
  const contexts = contextSystemApi.getContexts(id);

  const type = contextsType(contexts);
  const path = contextsPath(contexts);
  const data = contextsData(contexts, { path, type, event });

  const action = getActionName(onAction, { data, type, path, event });

  return handleNamedAction(contextSystemApi, contexts, action, { path, data, type, event });
};
export default contextHandleLocalEvent;
