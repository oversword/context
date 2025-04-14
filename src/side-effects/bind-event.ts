import { EventTypes, EVENT_NAMES } from '@/types/dom-events.types'

const bindEvent = <E extends keyof EventTypes>(
	element: HTMLElement,
	eventName: E,
	handler: EventTypes[E],
): void => {
	switch (eventName) {
	case EVENT_NAMES.CLICK:
	case EVENT_NAMES.DOUBLE_CLICK:
		return element.addEventListener(eventName, handler as EventTypes[EVENT_NAMES.DOUBLE_CLICK])
	case EVENT_NAMES.MOUSE_DOWN:
		return element.addEventListener(eventName, handler as EventTypes[EVENT_NAMES.MOUSE_DOWN])
	case EVENT_NAMES.MOUSE_UP:
		return element.addEventListener(eventName, handler as EventTypes[EVENT_NAMES.MOUSE_UP])
	case EVENT_NAMES.KEY_UP:
		return element.addEventListener(eventName, handler as EventTypes[EVENT_NAMES.KEY_UP])
	case EVENT_NAMES.KEY_DOWN:
		return element.addEventListener(eventName, handler as EventTypes[EVENT_NAMES.KEY_DOWN])
	default:
		throw new ReferenceError(`${eventName} is not a recognised event`)
	}
}
export default bindEvent
