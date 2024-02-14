import { ReactElement } from 'react'
/**
 * Ensures the result of the `children` property is an array of ReactElements
 * 
 * If the input is falsey, return an empty list
 * If the input is a single ReactElement, return it in a list
 * If the input is an array of ReactElements, return it as-is
 * 
 * @param elements 
 * @returns A list of ReactElements
 */
const wrapElements = (
	elements: null | ReactElement | Array<ReactElement>,
): Array<ReactElement> => {
	if (!elements) return []
	if (Array.isArray(elements)) return elements
	return [elements]
}
export default wrapElements
