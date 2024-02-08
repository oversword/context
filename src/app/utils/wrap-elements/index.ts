import { ReactElement } from 'react'

const wrapElements = (
	elements: null | ReactElement | Array<ReactElement>,
): Array<ReactElement> => {
	if (!elements) return []
	if (Array.isArray(elements)) return elements
	return [elements]
}
export default wrapElements
