import {
  ContextAction,
  ContextActionName,
  StoreMetaList,
  ContextKeyList,
} from '../types/index.types';
import shallowMatch from '../utils/shallow-match';
import applyKeysConditions from './apply-keys-conditions';
import contextsActs from './contexts-acts';
import contextsKeys from './contexts-keys';
import splitCombination from '../utils/split-combination';
import PartialOmit from '../utils/partial-omit';
import { inactiveLog as log } from '../utils/debug-log';

const contextsKeysAction = (
  contexts: StoreMetaList,
  action: PartialOmit<ContextAction, 'action'>,
): ContextActionName | null => {
  const acts = contextsActs(contexts, action);
  const keys = contextsKeys(contexts, action);

  const filteredKeys = applyKeysConditions(keys, acts, action);
  const hasKeyBinds = Object.keys(filteredKeys).length !== 0;

  log({ acts, keys, action, filteredKeys, hasKeyBinds });
  if (hasKeyBinds) {
    const transposedKeys = (
      [] as Array<{ combination: ContextKeyList; action: ContextActionName }>
    ).concat(
      ...Object.entries(filteredKeys).map(
        ([action, keys]): Array<{ combination: ContextKeyList; action: ContextActionName }> =>
          keys.map((key: string): { combination: ContextKeyList; action: ContextActionName } => ({
            combination: splitCombination(key),
            action,
          })),
      ),
    );
    const { event } = action;
    if (event && 'combination' in event) {
      const matchedCombination = transposedKeys.find(({ combination }) =>
        shallowMatch(combination, event.combination),
      );
      if (matchedCombination) return matchedCombination.action;
    }
  }
  return null;
};
export default contextsKeysAction;
