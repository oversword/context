import getButtons from '../event/transformers/event-buttons'
import { HandleConfig } from '../types/dom-events.types'

const mouseDown: HandleConfig<MouseEvent> = {
	before: (event: MouseEvent) =>
		getButtons(event).reduce(
			(current, active, index) => ({ ...current, [`Button${index + 1}`]: active }),
			{},
		),
	keyInfo: (event: MouseEvent) => ({
		pos: `MouseButton${event.button}`,
		char: '',
		symbol: `Button${event.button}`,
	}),
}
export default mouseDown
