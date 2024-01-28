import { ContextAction, ContextActsGroup, ContextKeyListGroup } from '../types/index.types';
import PartialOmit from '../utils/partial-omit';
import evaluateCondition from './evaluate-condition';

const applyKeysConditions = (
  keys: ContextKeyListGroup,
  acts: ContextActsGroup,
  action: PartialOmit<ContextAction, 'action'>,
): ContextKeyListGroup =>
  Object.fromEntries(
    Object.entries(keys).filter(([key]): boolean => evaluateCondition(acts[key], action)),
  );

export default applyKeysConditions;
