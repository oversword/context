import styled from 'styled-jss'
import classes from './classes';
/**
 * ContextMenuItem React Element Styles
 */
const StyledDiv = styled('div')(() => ({
  [`&.${classes.ContextMenuItem}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    columnGap: '1em',
    padding: '0.5em 1em',
  },
  [`&.${classes.ContextMenuItemDisabled}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    columnGap: '1em',
    padding: '0.5em 1em',
    color: '#bbb',
  },
  [`&.${classes.ContextMenuItem}:hover`]: {
    background: '#44d',
    color: '#fff',
    cursor: 'pointer',
  },
  [`& > .${classes.ContextMenuItemLabel}`]: {
    whiteSpace: 'nowrap',
  },
  [`& > .${classes.ContextMenuItemKeys}`]: {
    color: '#999',
    whiteSpace: 'nowrap',
  },
}));

export default StyledDiv;
