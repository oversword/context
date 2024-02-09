import eventChar from '../../event/transformers/event-char'
import eventSymbol from '../../event/transformers/event-symbol'
import charMap from '../constants/char-map'
import symbolMap from '../constants/symbol-map'
import { HandleConfig } from '../types/dom-events.types'

const keyDown: HandleConfig<KeyboardEvent> = {
	before: (event: KeyboardEvent) => ({
		[eventSymbol(event, symbolMap)]: true,
	}),
	keyInfo: (event: KeyboardEvent) => ({
		pos: event.code,
		char: eventChar(event, charMap),
		symbol: eventSymbol(event, symbolMap),
	}),
}

export default keyDown
