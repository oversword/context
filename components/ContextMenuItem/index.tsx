import classes from './classes';
import Context from '../Context';
import { ContextConfig } from '../../types/index.types';
import StyledDiv from './style';
import { ContextMenuItemProps } from './index.types';
import displayKeys from '../../utils/display-keys';

const context: ContextConfig = {
  type: 'context-menu-item',
  keys: { select: ['Click', 'Enter', 'Space'] },
  acts: {
    'context-menu-item': (_action, acts) => ({
      select: {},
      ...acts,
    }),
  },
};

function ContextMenuItem({
  keys = [],
  action = 'error',
  data = null,
  label = null,
  disabled = false,
  ...passedProps
}: ContextMenuItemProps): React.ReactElement {
  return (
    <Context
      context={context}
      data={{
        ContextMenuItem_action: action,
        ContextMenuItem_data: data,
      }}
      className={disabled ? classes.ContextMenuItemDisabled : classes.ContextMenuItem}
      element={StyledDiv}
      {...passedProps}
    >
      <div className={classes.ContextMenuItemLabel}>{label || passedProps.title || '(Item)'}</div>
      {keys && keys.length ? (
        <div className={classes.ContextMenuItemKeys}>{displayKeys(keys)}</div>
      ) : null}
    </Context>
  );
}

ContextMenuItem.title = 'ContextMenu';
ContextMenuItem.defaultProps = {
  keys: [],
  action: 'error',
  data: null,
  label: null,
  title: null,
  disabled: false,
};

export default ContextMenuItem;
