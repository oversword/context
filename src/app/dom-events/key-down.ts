import getChar from '../../event/transformers/event-char'
import getSymbol from '../../event/transformers/event-symbols'
import { HandleConfig } from '../types/dom-events.types'

const keyDown: HandleConfig<KeyboardEvent> = {
	before: (event: KeyboardEvent) => ({
		[getSymbol(event)]: true,
	}),
	keyInfo: (event: KeyboardEvent) => ({
		pos: event.code,
		char: getChar(event),
		symbol: getSymbol(event),
	}),
}

export default keyDown
