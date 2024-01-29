import {createUseStyles} from 'react-jss'
import classes from './classes';
/**
 * ContextMenu React Element Styles
 */

const style = createUseStyles({
  [classes.ContextMenu]: {
    fontFamily: 'sans-serif',
    userSelect: 'none',
    background: '#fff',
    color: '#111',
    boxShadow: '0 3px 9px -2px rgba(0, 0, 0, 0.5)',
  },
  [classes.ContextMenuSection]: {
    padding: 0,
    borderTop: '1px solid',
    borderBottom: '1px solid',
    display: 'block',
  },
  [classes.ContextMenuSectionLabel]: {
    padding: '0.5em 1em',
    color: '#aaa',
    whiteSpace: 'nowrap',
  },
});
export default style;
