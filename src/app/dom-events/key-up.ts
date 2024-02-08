import getSymbol from '../event/transformers/event-symbols'
import { HandleConfig } from '../types/dom-events.types'

const keyUp: HandleConfig<KeyboardEvent> = {
	before: (event: KeyboardEvent) => ({
		[getSymbol(event)]: false,
	}),
}

export default keyUp
