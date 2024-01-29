import { ContextActionName, ContextId, ContextInterceptConfig } from './index.types';
import { SelectorParserStack } from '../utils/selector.types';

export interface InterceptDefinition {
  path: SelectorParserStack;
  callback: ContextInterceptConfig;
}

export interface ActionDefinition {
  id: ContextId;
  action: ContextActionName;
}
