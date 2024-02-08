import { ContextAction, ContextActsGroup, ContextKeyListGroup } from '../../types/index.types';
import PartialOmit from '../../types/partial-omit';
import evaluateCondition from '../../conditions/evaluate-condition';

const keysApplyConditions = (
  keys: ContextKeyListGroup,
  acts: ContextActsGroup,
  action: PartialOmit<ContextAction, 'action'>,
): ContextKeyListGroup =>
  Object.fromEntries(
    Object.entries(keys).filter(([key]): boolean => evaluateCondition(acts[key], action)),
  );

export default keysApplyConditions;
