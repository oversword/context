/**
 * Compare two arrays
 *
 * Each array must contain the same items
 * regardless of order.
 *
 * @param a
 * @param b
 * @returns true if the arrays contain the same items
 */
const shallowMatch = (a: Array<unknown>, b: Array<unknown>): boolean =>
	a.length === b.length && a.every(item => b.includes(item))
export default shallowMatch
