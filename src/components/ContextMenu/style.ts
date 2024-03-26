import {createUseStyles} from 'react-jss'
import classes from './classes'
/**
 * ContextMenu React Element Styles
 */

const style = createUseStyles({
	[classes.ContextMenu]: {
		fontFamily: 'sans-serif',
		fontSize: '14px',
		userSelect: 'none',
		background: '#fff',
		color: '#111',
		boxShadow: '0 3px 9px -2px rgba(0, 0, 0, 0.5)',
		borderRadius: '3px',
	},
	[classes.ContextMenuSection]: {
		padding: 0,
		borderTop: '1px solid',
		display: 'block',
		['&:first-child']: {
			borderTop: 'none',
		},
	},
	[classes.ContextMenuSectionLabel]: {
		padding: '0.5em 1em',
		color: '#888',
		fontSize: '0.9em',
		whiteSpace: 'nowrap',
	},
})
export default style
