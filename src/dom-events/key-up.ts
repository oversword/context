import symbolMap from '@/constants/symbol-map'
import eventSymbol from '@/generic/event/transformers/event-symbol'
import { HandleConfig } from '@/types/dom-events.types'

const keyUp: HandleConfig<KeyboardEvent> = {
	before: (event: KeyboardEvent) => ({
		[eventSymbol(event, symbolMap)]: false,
	}),
}

export default keyUp
