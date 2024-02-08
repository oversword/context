import { HandleConfig } from '../types/dom-events.types'

const click: HandleConfig<MouseEvent> = {
	before: () => ({
		Click: true,
	}),
	keyInfo: () => ({
		pos: 'MouseClick',
		char: '',
		symbol: 'Click',
	}),
	after: () => ({
		Click: false,
	}),
}
export default click
