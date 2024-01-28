import {
  ContextAction,
  ContextMenuItemFilled,
  ContextMenuItemListFilled,
  ContextActsGroup,
} from '../types/index.types';
import filterTruthy from '../utils/filter-truthy';
import PartialOmit from '../utils/partial-omit';
import evaluateCondition from './evaluate-condition';
import evaluateDisabled from './evaluate-disabled';

const applyMenuConditions = (
  menu: ContextMenuItemListFilled,
  acts: ContextActsGroup,
  action: PartialOmit<ContextAction, 'action'>,
): ContextMenuItemListFilled =>
  menu
    .map((menuItem: ContextMenuItemFilled): false | ContextMenuItemFilled => {
      const ret: ContextMenuItemFilled = { ...menuItem };
      if ('action' in menuItem && menuItem.action) {
        const options = acts[menuItem.action];
        if (!evaluateCondition(options, action)) return false;
        if (evaluateDisabled(options, action)) ret.disabled = true;
      }
      if ('children' in menuItem && menuItem.children) {
        ret.children = applyMenuConditions(menuItem.children, acts, action);
      }
      return ret;
    })
    .filter(filterTruthy) as ContextMenuItemListFilled;

export default applyMenuConditions;
