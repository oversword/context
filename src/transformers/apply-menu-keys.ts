import {
  ContextAction,
  ContextMenuItemFilled,
  ContextMenuItemListFilled,
  ContextKeyListGroup,
} from '../types/index.types';
import PartialOmit from '../utils/partial-omit';

const applyMenuKeys = (
  menu: ContextMenuItemListFilled,
  keys: ContextKeyListGroup,
  action: PartialOmit<ContextAction, 'action'>,
): ContextMenuItemListFilled =>
  menu.map(
    (menuItem: ContextMenuItemFilled): ContextMenuItemFilled => ({
      ...(menuItem.action && keys[menuItem.action] ? { keys: keys[menuItem.action] } : {}),
      ...menuItem,
      ...(menuItem.children ? { children: applyMenuKeys(menuItem.children, keys, action) } : {}),
    }),
  );

export default applyMenuKeys;
