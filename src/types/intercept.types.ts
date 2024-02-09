import { ContextActionName, ContextId, ContextInterceptConfig } from './index.types'

export interface InterceptDefinition {
  priority: number;
  callback: ContextInterceptConfig;
}

export interface ActionDefinition {
  id: ContextId;
  action: ContextActionName;
}
