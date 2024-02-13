import { HandleConfig } from 'types/dom-events.types'

const doubleClick: HandleConfig<MouseEvent> = {
	before: () => ({
		DoubleClick: true,
	}),
	keyInfo: () => ({
		pos: 'MouseDoubleClick',
		char: '',
		symbol: 'DoubleClick',
	}),
	after: () => ({
		DoubleClick: false,
	}),
}
export default doubleClick
