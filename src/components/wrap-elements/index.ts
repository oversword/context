import { ReactNode } from 'react'
/**
 * Ensures the result of the `children` property is an array of ReactNodes
 * 
 * If the input is falsey, return an empty list
 * If the input is a single ReactNode, return it in a list
 * If the input is an array of ReactNodes, return it as-is
 * 
 * @param elements 
 * @returns A list of ReactNodes
 */
const wrapElements = (
	elements: ReactNode,
): Array<ReactNode> => {
	if (!elements) return []
	if (Array.isArray(elements)) return elements
	return [elements]
}
export default wrapElements
