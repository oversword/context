import charMap from '../../../app/constants/char-map'

/**
 * Get character from KeyboardEvent information
 *
 * @param _code Event.code
 * @param key   Event.key
 *
 * @returns     The character that would be printed in a text input when this key is pressed
 * @returns     An empty string if no character would be printed
 */
const getChar = ({ key }: KeyboardEvent): string => (key.length === 1 ? key : charMap[key]) || ''
export default getChar
