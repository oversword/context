/**
 * Splits a key combination in the format "Key+Other+9++" into the format ['Key','Other','9','+']
 *
 * @param keys A plus(+)-separated string representing a key combination
 *
 * @returns A list of individual keys
 */
const splitCombination = (keys: string): Array<string> => keys.split('+').map(k => k || '+')
export default splitCombination
