import { ContextActionName, ContextId, ContextInterceptConfig } from './index.types'
import { SelectorParserStack } from '../utils/selector/index.types'

export interface InterceptDefinition {
  priority: number;
  callback: ContextInterceptConfig;
}

export interface ActionDefinition {
  id: ContextId;
  action: ContextActionName;
}
