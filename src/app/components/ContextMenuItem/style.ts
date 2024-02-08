import {createUseStyles} from 'react-jss'
import classes from './classes'

/**
 * ContextMenuItem React Element Styles
 */
const style = createUseStyles({
	[classes.ContextMenuItem]: {
		display: 'flex',
		justifyContent: 'space-between',
		columnGap: '1em',
		padding: '0.5em 1em',
		['&:hover']: {
			background: '#44d',
			color: '#fff',
			cursor: 'pointer',
		},
	},
	[classes.ContextMenuItemDisabled]: {
		display: 'flex',
		justifyContent: 'space-between',
		columnGap: '1em',
		padding: '0.5em 1em',
		color: '#bbb',
	},
	[classes.ContextMenuItemLabel]: {
		whiteSpace: 'nowrap',
	},
	[classes.ContextMenuItemKeys]: {
		color: '#999',
		whiteSpace: 'nowrap',
	},
})
export default style
