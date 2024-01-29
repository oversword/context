import { ContextAction, ContextActsGroup, StoreMetaList } from '../types/index.types';
import PartialOmit from '../utils/partial-omit';
import { pathExtract, pathMatch } from '../utils/selector';

const contextsActs = (
  contexts: StoreMetaList,
  action: PartialOmit<ContextAction, 'action'>,
): ContextActsGroup =>
  contexts.reduce((current: ContextActsGroup, { config }): ContextActsGroup => {
    const { acts } = config;
    if (!acts) return current;

    const matchingActs = Object.keys(acts).map(pathExtract).filter(pathMatch(action.path));
    return matchingActs.reduce(
      (current: ContextActsGroup, type: ReturnType<typeof pathExtract>): ContextActsGroup => {
        const actsGen = acts[type.path];
        if (typeof actsGen === 'function') return actsGen(action, current);
        Object.entries(actsGen).forEach(([action, options]) => {
          if (action in current) {
            current[action] = {
              ...current[action],
              ...options,
            };
          } else {
            current[action] = options;
          }
        });
        return current;
      },
      current,
    );
  }, {});

export default contextsActs;
